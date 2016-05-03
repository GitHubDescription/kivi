import {VNode} from './vnode';
import {XmlNamespace, XlinkNamespace} from './namespace';

type VNodeList = Array<VNode|VNodeList[]>;

export function flattenVNodes(nodes: VNodeList) : VNode[] {
  let copy = nodes.slice(0);
  let flatten = [];
  while (copy.length > 0) {
    const item = copy.shift();
    if (item.constructor === VNode) {
      flatten.push(item)
    } else {
      copy = item.concat(copy)
    }
  }
  return flatten
}

/**
 * Set attribute
 */
export function setAttr(node: Element, key: string, value: string) : void {
  if (key[0] !== 'x') {
    node.setAttribute(key, value);
  } else {
    if (key[1] === 'm' && key[2] === 'l') {
      node.setAttributeNS(XmlNamespace, key, value);
    } else if (key[1] === 'l' && key[2] === 'i') {
      node.setAttributeNS(XlinkNamespace, key, value);
    } else {
      node.setAttribute(key, value);
    }
  }
}

/**
 * Sync attributes with static shape
 */
export function syncStaticShapeAttrs(a: {[key: string]: any}, b: {[key: string]: any}, node: Element) : void {
  if ('<@KIVI_DEBUG@>' !== 'DEBUG_DISABLED') {
    if (a === null || b === null) {
      throw new Error('Failed to update attrs with static shape: attrs object have dynamic shape.');
    }
  }

  let keys = Object.keys(a);
  let key: string;
  let i: number;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    if ('<@KIVI_DEBUG@>' !== 'DEBUG_DISABLED') {
      if (!b.hasOwnProperty(key)) {
        throw new Error('Failed to update attrs with static shape: attrs object have dynamic shape.');
      }
    }
    const bValue = b[key];
    if (a[key] !== bValue) {
      setAttr(node, key, bValue);
    }
  }

  if ('<@KIVI_DEBUG@>' !== 'DEBUG_DISABLED') {
    keys = Object.keys(b);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      if (!a.hasOwnProperty(key)) {
        throw new Error('Failed to update attrs with static shape: attrs object have dynamic shape.');
      }
    }
  }
}

/**
 * Sync attributes with dynamic shape
 */
export function syncDynamicShapeAttrs(a: {[key: string]: any}, b: {[key: string]: any}, node: Element) : void {
  let i: number;
  let keys: string[];
  let key: string;

  if (a !== null) {
    if (b === null) {
      // b is empty, remove all attributes from a
      keys = Object.keys(a);
      for (i = 0; i < keys.length; i++) {
        node.removeAttribute(keys[i]);
      }
    } else {
      // Remove and update attributes
      keys = Object.keys(a);
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (b.hasOwnProperty(key)) {
          let bValue = b[key];
          if (a[key] !== bValue) {
            setAttr(node, key, bValue);
          }
        } else {
          node.removeAttribute(key);
        }
      }

      // Insert new attributes
      keys = Object.keys(b);
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (!a.hasOwnProperty(key)) {
          setAttr(node, key, b[key]);
        }
      }
    }
  } else if (b !== null) {
    // a is empty, insert all attributes from b
    keys = Object.keys(b);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      setAttr(node, key, b[key]);
    }
  }
}

/**
 * Sync properties with static shape
 */
export function syncStaticShapeProps(a: {[key: string]: any}, b: {[key: string]: any}, node: Element) : void {
  if ('<@KIVI_DEBUG@>' !== 'DEBUG_DISABLED') {
    if (a === null || b === null) {
      throw new Error('Failed to update props with static shape: props object have dynamic shape.');
    }
  }

  let keys = Object.keys(a);
  let key: string;
  let i: number;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    if ('<@KIVI_DEBUG@>' !== 'DEBUG_DISABLED') {
      if (!b.hasOwnProperty(key)) {
        throw new Error('Failed to update props with static shape: props object have dynamic shape.');
      }
    }
    const bValue = b[key];
    if (a[key] !== bValue) {
      (node as any)[key] = bValue;
    }
  }

  if ('<@KIVI_DEBUG@>' !== 'DEBUG_DISABLED') {
    keys = Object.keys(b);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      if (!a.hasOwnProperty(key)) {
        throw new Error('Failed to update attrs with static shape: attrs object have dynamic shape.');
      }
    }
  }
}

/**
 * Sync properties with dynamic shape
 */
export function syncDynamicShapeProps(a: {[key: string]: any}, b: {[key: string]: any}, node: Element) : void {
  let i: number;
  let keys: string[];
  let key: string;

  if (a !== null) {
    if (b === null) {
      // b is empty, remove all attributes from a.
      keys = Object.keys(a);
      for (i = 0; i < keys.length; i++) {
        (node as any)[keys[i]] = void 0;
      }
    } else {
      // Remove and update attributes.
      keys = Object.keys(a);
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (b.hasOwnProperty(key)) {
          let bValue = b[key];
          if (a[key] !== bValue) {
            (node as any)[key] = bValue;
          }
        } else {
          (node as any)[key] = void 0;
        }
      }

      // Insert new attributes.
      keys = Object.keys(b);
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (!a.hasOwnProperty(key)) {
          (node as any)[key] = b[key];
        }
      }
    }
  } else if (b !== null) {
    // a is empty, insert all attributes from b.
    keys = Object.keys(b);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      (node as any)[key] = b[key];
    }
  }
}