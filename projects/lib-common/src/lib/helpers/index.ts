import { forEach, isObject } from 'lodash';


export * from './carousel/carousel';
export * from './stack/stack';


export function plainToFlattenObject(object) {
  const result = {};

  function flatten(obj, prefix = "") {
    forEach(obj, (value, key) => {
      if ( !value ) return;

      if ( isObject(value) ) {
        flatten( value, `${ prefix }${ key }.` );
      } 
      else {
        result[ `${ prefix }${ key }` ] = value;
      }
    })
  }

  flatten( object );
  return result;
}
