/* eslint-disable object-property-newline */
import generators from './generators';
import asyncGenerators from './asyncGenerators';
import AbstractIterable from './AbstractIterable';
import { Iterable, iterate, repeat } from './Iterable';
import { AsyncIterable } from './AsyncIterable';
// subtypes
import { ArrayIterable, fromArray, fromValues } from './subtypes/ArrayIterable';
import { EmptyIterable, EMPTY } from './subtypes/EmptyIterable';
import {
  EnumerationIterable,
  enumFrom, enumFromThen, enumFromTo, enumFromThenTo, range,
} from './subtypes/EnumerationIterable';
import { MapIterable } from './subtypes/MapIterable';
import { ObjectIterable, fromObject } from './subtypes/ObjectIterable';
import { SetIterable } from './subtypes/SetIterable';
import { SingletonIterable } from './subtypes/SingletonIterable';
import { StringIterable, fromString } from './subtypes/StringIterable';

export {
  AbstractIterable,
  Iterable, iterate, repeat,
  AsyncIterable,
  ArrayIterable, fromArray, fromValues,
  EmptyIterable, EMPTY,
  EnumerationIterable, enumFrom, enumFromThen, enumFromTo, enumFromThenTo, range,
  MapIterable,
  ObjectIterable, fromObject,
  SetIterable,
  SingletonIterable,
  StringIterable, fromString,
  generators,
  asyncGenerators,
};

export default {
  AbstractIterable,
  Iterable, iterate, repeat,
  AsyncIterable,
  ArrayIterable, fromArray, fromValues,
  EmptyIterable, EMPTY,
  EnumerationIterable, enumFrom, enumFromThen, enumFromTo, enumFromThenTo, range,
  MapIterable,
  ObjectIterable, fromObject,
  SetIterable,
  SingletonIterable,
  StringIterable, fromString,
  generators,
  asyncGenerators,
};
