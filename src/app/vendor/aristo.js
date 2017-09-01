import { el, text, setChildren, setAttr, list, svg } from 'redom';
const $ = document.querySelectorAll.bind(document);

class V {
  constructor (tag, attr, children) {
    this.tag(tag);
    this.attr(attr);
    this.children(children);
  }
  key (key) { this._key = key; return this; }
  tag (tag) { this._tag = tag; return this; }
  text (text) { this._text = text; return this; }
  el (el) { this._el = el; return this; }
  attr (attr) {
    if (attr != null) {
      if (attr.key != null) {
        this.key(attr.key);
        attr.key = null;
        delete attr.key;
      }
    }
    this._attr = attr;

    return this;
  }
  overwrite (overwrite) { this._overwrite = (overwrite != null)? overwrite: true; return this; }
  list (list, child, key) {
    this._list = list;
    this._listChild = child;
    this._listKey = key;

    return this;
  }
  children (children) { this._children = children; return this; }
  get (getFutureSelf) {
    let self = this;
    let _el;

    if (this._el != null) {
      _el = (this._el.call != null)? this._el(): this._el;
    } else if (this._list != null) {
      if (this._listChild.call != null) {
        class ListItem {
          constructor() {
            this.el = document.createDocumentFragment();
            this.vmount = vm()
          }
          update(item, key) {
            var v = (getFutureSelf != null)? getFutureSelf(): self;
            this.vmount(this.el, v._listChild(item, key));
          }
        }
        _el = list(this._tag, ListItem, this._listKey);
      } else {
        _el = list(this._tag, this._listChild, this._listKey);
      }
    } else if (this._tag != null) {
      if (this._tag == 'fragment') {
        _el = document.createDocumentFragment();
      } else if (this._tag == 'svg') {
        _el = svg(this._tag);
      } else {
        _el = el(this._tag);
      }
    } else if (this._text != null) {
      _el = text();
    }

    if (this._attr != null) {
      let attrs = Object.create(null);
      if (this._attr.onremount != null) attrs.onremount = this._attr.onremount;
      if (this._attr.onunmount != null) attrs.onunmount = this._attr.onunmount;
      if (this._attr.onmount != null) attrs.onmount = this._attr.onmount;
      attrs = Object.keys(this._attr).reduce((acc, k) => {
        if (acc[k] == null && this._attr[k] != null && this._attr[k].call != null) {
          acc[k] = this._attr[k];
        }

        return acc;
      }, attrs);
      setAttr(_el, attrs);
    }

    return _el;
  }
}
export const v = function(tag, key, children) {
  return new V(tag, key, children);
}

export default v;

const isHandlerAttr = function(key) {
  return key.indexOf('on') === 0;
}

const isNotHandlerAttr = function(key) {
  return key.indexOf('on') !== 0;
}

const filterAttr = function(attr, filter) {
  return Object.keys(attr)
    .filter(filter)
    .reduce((acc, key) => {
      acc[key] = attr[key];
      return acc;
    }, {});
}

const _getElFromTree = function(state, v, keyPrefix) {
  let tree = state.tree;

  keyPrefix = (keyPrefix != null)? keyPrefix: '';
  let key = (v._key != null)? keyPrefix + v._key: null;

  if (v.length != null) {
    return v.filter((v) => v != null).map((_v) => _getElFromTree(state, _v, keyPrefix));
  } else {
    let vel;

    if (key != null) {
      tree.vByKey[key] = v;
      if (tree.keyed[key] == null || v._overwrite === true) {
        let getFutureV;
        if (v._list != null) {
          getFutureV = function() {
            return tree.vByKey[key];
          };
        }
        tree.keyed[key] = v.get(getFutureV)
      }
      vel = tree.keyed[key];
    } else {
      if (v.id != null) {
        vel = v;
      } else {
        vel = v.get();
      }
    }

    if (v._text != null) {
      vel.textContent = v._text;
    }

    if (v._attr != null) {
      let filteredAttrs = filterAttr(v._attr, isNotHandlerAttr);
      setAttr(vel, filteredAttrs);
    }

    if (v._list != null) {
      vel.update(v._list);
    }

    if (v._children != null) {
      let newKeyPrefix = ((key != null)? key: (keyPrefix + '<el>')) + '<$>';
      let children = _getElFromTree(state, v._children, newKeyPrefix)
      if (v._children.length == null) children = [ children ];
      setChildren(vel, children);
    }

    return vel;
  }
}
const _vmount = function(parent, vtree) {
  if (vtree == null) {
    parent.innerHTML = null;
  } else {
    let children = _getElFromTree(this, vtree);
    setChildren(parent, children);
  }
}

export const vm = function() {
  var state = {
    tree: {
      keyed: {},
      unkeyed: {},
      vByKey: {},
    }
  };

  return _vmount.bind(state)
}
