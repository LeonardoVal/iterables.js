import generators from './generators';
import asyncGenerators from './generators-async';
import AbstractIterable from './AbstractIterable';
import Iterable from './Iterable';
import AsyncIterable from './AsyncIterable';
// subtypes
import { ArrayIterable, fromArray, fromValues } from './subtypes/ArrayIterable';
import { EmptyIterable, EMPTY } from './subtypes/EmptyIterable';
import EnumerationIterable from './subtypes/EnumerationIterable';
import MapIterable from './subtypes/MapIterable';
import { ObjectIterable, fromObject } from './subtypes/ObjectIterable';
import SetIterable from './subtypes/SetIterable';
import SingletonIterable from './subtypes/SingletonIterable';
import { StringIterable, fromString } from './subtypes/StringIterable';

export default {
  AbstractIterable,
  Iterable,
  AsyncIterable,
  ArrayIterable,
  fromArray,
  fromValues,
  EmptyIterable,
  EMPTY,
  EnumerationIterable,
  MapIterable,
  ObjectIterable,
  fromObject,
  SetIterable,
  SingletonIterable,
  StringIterable,
  fromString,
  generators: { ...generators, async: asyncGenerators },
};
