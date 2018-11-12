/** 
  * Element creator
  * 
  * Allows for programatic dom tree creation using a proxy
  * Example: 
  *   Element.div([
  *     Element.p([], { className: 'fun-times; })
  *   ])
**/
  const Element = (() => {
    // supported DOM events
    const listeners = ['change', 'input', 'click', 'blur', 'focus'];
  
    /**
     * returns either the supplied DOM node, or a new text node
     * String | Number -> TextNode
     * otherwise, return the child
     * 
     * Warning! No support for weird supplied values like [] or {}.
     * Since this function is local to the `Element`, only strings, numbers, or valid DOM
     * nodes should be passed to it
     */
    const childFromType = child =>
      typeof child === 'string' || typeof child === 'number' ? document.createTextNode(child) : child;
  
    const childrenToList = children =>
      Array.isArray(children) ? children : [ children ];
  
    const mapAttributesToNode = (attributes, el) =>
      Object.keys(attributes).forEach((attr) => {
        let attribute = attr;
        let attributeValue = attributes[attr];
  
        if (typeof attributeValue === undefined) {
          attributeValue = '';
        }
  
        if (listeners.indexOf(attr) !== -1) {
          el.addEventListener(attr, attributeValue);
        } else {
          if (attr === 'className') {
            attribute = 'class';
          } else if (attr === 'htmlFor') {
            attribute = 'for';
          }
  
          el.setAttribute(attribute, attributeValue);
        }
      });
    
    const appendChildrenToParent = (children, parent) => {
      for (let child of children) {
        if (child) {
          parent.appendChild(childFromType(child));
        } else {
          continue;
        }
      }
    };
  
    return new Proxy({}, {
      get(target, property, receiver) {
        return (children, attrs = {}) => {
          const el = document.createElement(property);
          // ensure that the `children` argument is an array
          const normalizedChildren = childrenToList(children);
  
          mapAttributesToNode(attrs, el);
          appendChildrenToParent(normalizedChildren, el);
  
          return el;
        };
      }
    });
  })();

  export default Element;