const { readEventsFromStream, EventData, writeEventsToStream } = require('@eventstore/db-client');
const { connection } = require('./databaseConnection');
const { v4: uuidV4 } = require('uuid');

async function readAggregateFromStream(aggregateType, aggregateId, handlers) {
  const readEventsResponse = await readEventsFromStream(`${aggregateType}-${aggregateId}`).forward().fromStart().count(1000).execute(connection);

  const events = readEventsResponse.map((e) => e.event);

  const aggregate = events.reduce((a, e) => handlers[e.eventType](a, e.data), {});

  return {
    aggregate,
    currentVersion: events[events.length - 1].revision
  };
}

async function saveNewEvents(aggregateType, aggregateId, events, expectedRevision) {
  const mappedEvents = events.map(({ id, type, ...data }) => EventData.json(type, data).eventId(uuidV4()).build());

  await writeEventsToStream(`${aggregateType}-${aggregateId}`).expectedRevision(expectedRevision).send(...mappedEvents).execute(connection);
}

function validateInvariants(aggregate, events, handlers, invariants) {
  const newAggregate = events.reduce((a, e) => handlers[e.type](a, e), aggregate);

  const invariantErrors = Object.keys(invariants)
    .reduce((messages, invariantName) => {
      if (invariants[invariantName](newAggregate) !== null) {
        messages.push(`${invariantName}: ${result}`)

        return messages;
      }

      return messages;
    }, []);

  if (invariantErrors.length !== 0) {
    const allErrorsMessage = invariantErrors.join('\n');

    throw new Error(`InvariantError:\n${allErrorsMessage}`);
  }
}

async function commandHandler(aggregateFunction, command, handlers, invariants, aggregateType, aggregateId) {
  const { aggregate, currentVersion } = await readAggregateFromStream(aggregateType, aggregateId, handlers);

  let events = aggregateFunction(command, aggregate);

  if (events === null) {
    return;  // null from aggregate function means idempotent operation
  }

  events = Array.isArray(events) ? events : [events]

  validateInvariants(aggregate, events, handlers, invariants);

  await saveNewEvents(aggregateType, aggregateId, events, currentVersion)
};

async function firstCommandHandler(aggregateFunction, command, handlers, invariants, aggregateType) {
  const event = aggregateFunction(command);

  validateInvariants({}, [event], handlers, invariants);

  await saveNewEvents(aggregateType, event.aggregateId, [event], 'no_stream')
};

module.exports = {
  commandHandler,
  firstCommandHandler
};
