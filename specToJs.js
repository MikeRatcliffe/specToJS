/**
 * Check if the current node is a node with the style `position:absolute`.
 */
get absolute() {
  return this.style.position === "absolute";
}

/**
 * Check if the current node accepts input.
 */
get acceptsInput() {
  return this.nodeNameOneOf([
    "color", "date", "datetime", "datetime-local", "email",
    "input", "month", "number", "range", "search", "select",
    "tel", "textarea", "time", "url", "week",
  ]);
}

/**
 * Check if the current node accepts width or height. Width applies to all
 * elements but non-replaced inline elements, table rows and row groups.
 * Height applies to all elements but non-replaced inline elements, table
 * columns and column groups.
 */
get acceptsWidthAndHeight() {
  // We can omit table rows and row groups because they don't accept width and
  // table columns and column groups because they only accept height.
  return !(this.nonReplaced && this.inline) &&
          !this.tableRow && !this.tableRowGroup &&
          !this.tableColumn && !this.tableColumnGroup;
}

/**
 * Check if the current node accepts width. Width applies to all elements but
 * non-replaced inline elements, table rows and row groups.
 */
get acceptsWidth() {
  return !(this.nonReplaced && this.inline) &&
          !this.tableRow && !this.tableRowGroup;
}

/**
 * Check if the current node accepts height. Height applies to all elements
 * but non-replaced inline elements, table columns and column groups.
 */
get acceptsHeight() {
  return !(this.nonReplaced && this.inline) &&
          !this.tableColumn && !this.tableColumnGroup;
}

/**
 * Check if the current node is a block container i.e. contains only
 * inline-level boxes participating in an inline formatting context or
 * contains only block-level boxes participating in a block formatting context.
 */
get blockContainer() {
  return this.blockContainerWithBlockContext ||
          this.blockContainerWithInlineContext;
}

/**
 * Check if the current node is a block level container that establishes a
 * block context i.e. a block level element that contains only block level
 * children.
 */
get blockContainerWithBlockContext() {
  if (!this.blockLevelElement) {
    return false;
  }

  for (const child of this.node.children) {
    if (this.isBlock(child)) {
      return true;
    }
  }

  return true;
}

/**
 * Check if the current node is a block level container that establishes an
 * inline context i.e. a block level element that contains no block level
 * children.
 */
get blockContainerWithInlineContext() {
  if (!this.blockLevelElement) {
    return false;
  }

  for (const child of this.node.children) {
    if (this.isBlock(child)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if the current node is a block level element.
 */
get blockLevelElement() {
  return this.isBlock(this.node);
}

/**
 * Check if a node's propName is set to one of the values passed in the values
 * array.
 *
 * @param {DOMNode} node
 *        The node to check.
 * @param {String} propName
 *        Property name to check.
 * @param {Array} values
 *        Values to compare against.
 */
checkStyleForNode(node, propName, values) {
  for (const value of values) {
    if (this.style[propName] === value) {
      return true;
    }
  }
  return false;
}

/**
 * Check if any of a node's children contain a property name with a value
 * contained in the values array.
 *
 * @param {String} propName
 *        Property name to check.
 * @param {Array} values
 *        Values to compare against.
 */
childHasStyleOneOf(propName, values) {
  for (const child of this.node.children) {
    const style = getComputedStyle(child);

    for (const value of values) {
      if (style[propName] === value) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if the current node is a disabled node i.e. a node that has the
 * `disabled` attribute set.
 */
get disabled() {
  return this.node.getAttribute("disabled");
}

/**
 * Check if the current node is a fixed node i.e. a node that has a style of
 * `position:fixed`.
 */
get fixed() {
  return this.style.position === "fixed";
}

/**
 * Check if the current node is floated i.e. one with the `float` property set
 * to anything except `none`.
 */
get floated() {
  return this.style.cssFloat !== "none";
}

/**
 * Check if the current node has an animation name.
 */
get hasAnimationName() {
  return this.style.animationName !== "none";
}

/**
 * Check if the current node has an ancestor that is a grid element.
 */
get hasGridAncestor() {
  let currNode = this.node;

  while (currNode) {
    if (this.isGridElement(currNode)) {
      return true;
    }
    currNode = currNode.parentElement;
  }
  return false;
}

get hasSvgNamespace() {
  return this.node.namespaceURI === "http://www.w3.org/2000/svg";
}
/**
 * Check if the current node has a transform property.
 */
get hasTransform() {
  return this.style.transform !== "none";
}

/**
 * Check if the current node has a transitionDuration property.
 */
get hasTransitionDuration() {
  return this.style.transitionDuration !== "0s";
}

/**
 * Check if the current node has a horizontal scrollbar.
 */
get hasHorizontalScrollbar() {
  if (this.style.overflow === "hidden") {
    return false;
  }
  return this.node.scrollWidth > this.node.clientWidth;
}

/**
 * Check if the current node has a scrollbar.
 */
get hasScrollbar() {
  return this.hasHorizontalScrollbar || this.hasVerticalScrollbar;
}

/**
 * Check if the current node has a vertical scrollbar.
 */
get hasVerticalScrollbar() {
  if (this.style.overflow === "hidden") {
    return false;
  }
  return this.node.scrollHeight > this.node.clientHeight;
}

/**
 * Check if the current node is in flow.
 */
get inFlow() {
  return this.style.display !== "none" &&
          !this.floated &&
          (this.absolute || this.fixed);
}

/**
 * Check if the current node is an inline element.
 */
get inline() {
  return this.style.display.startsWith("inline");
}

/**
 * Check if the current node has a style of `display:inline-block`.
 */
get inlineBlock() {
  return this.style.display === "inline-block";
}

/**
 * Check if the current node is a non-replaced inline box.
 */
get nonReplacedInlineBox() {
  return this.nonReplaced && this.style.display === "inline";
}

/**
 * Check if the current node is an inline table.
 */
get inlineTable() {
  return this.style.display === "inline-table";
}

/**
 * Check if the current node is an internal ruby box. Ruby bases, ruby
 * annotations, ruby base containers, and ruby annotation containers are
 * internal ruby boxes.
 */
get internalRubyBox() {
  let match = this.checkStyle("display", [
    "ruby-base", "ruby-text", "ruby-text-container",
  ]);

  if (!match) {
    match = this.nodeName === "rbc";
  }

  return match;
}

/**
 * Check if the current node is an internal table element i.e. one that
 * produces a row, row group, column, column group, or cell.
 */
get internalTableElement() {
  return this.checkStyle("display", [
    "table-row", "table-row-group", "table-column", "table-column-group",
    "table-cell", "table-header-group", "table-footer-group",
  ]);
}

/**
 * Check if the current node is an internal table element and also not a table
 * cell i.e. one that produces a row, row group, column or column group.
 */
get internalTableElementExceptTableCells() {
  if (this.tableCell) {
    return false;
  }
  return this.internalTableElement;
}

/**
 * Check if the current node is an internal table element i.e. one that
 * produces a row, row group, column, column group, or cell and that it
 * is a descendant of a table with the sgtyle `border-collapse:collapse`.
 */
get internalTableElementWhereBorderCollapseIsCollapse() {
  return !(this.internalTableElement &&
            this.node.closest("table").style.borderCollapse === "collapse");
}

/**
 * Check if a node is a block level element.
 *
 * @param {DOMNode} node
 *        The node to check.
 */
isBlock(node) {
  return this.checkStyleForNode(node, "display", [
    "block", "inline-block", "flex", "inline-flex", "grid", "inline-grid",
  ]);
}

/**
 * Check if a node is a grid element.
 *
 * @param {DOMNode} node
 *        The node to check.
 */
isGridElement(node) {
  return this.blockLevelElement &&
    this.style.gridTemplateAreas === "" ||
    this.style.gridTemplateRows === "" ||
    this.style.gridTemplateColumns === "";
}

/**
 * Check if the current node is a pseudo element.
 */
isPseudo(name) {
  if (name.startsWith("::")) {
    name = name.substring(2);
  }
  return this._cssRule.selectorText.endsWith(`::${name}`);
}

/**
 * Check if the current node has the style `display:list-item`;
 */
get listItem() {
  return this.style.display === "list-item";
}

/**
 * Check if the current node has the style `list-style-type:none`.
 */
get listStyleTypeNone() {
  return this.style.listStyleType === "none";
}

/**
 * Check if the current node has the style `display:marker`;
 */
get marker() {
  return this.style.display === "marker";
}

/**
 * Check if the current node is a multi column element.
 */
get multiColContainer() {
  return this.style.columnCount > 0;
}

/**
 * Return the current node's nodeName.
 */
get nodeName() {
  return this.node.nodeName;
}

/**
 * Check if the current node's nodeName matches a value inside the value array.
 *
 * @param {Array} values
 *        Array of values to compare against.
 */
nodeNameOneOf(values) {
  return values.includes(this.nodeName);
}

/**
 * Check if the current node is a non-replaced element. See `replaced()` for
 * a description of what a replaced element is.
 */
get nonReplaced() {
  return !this.replaced;
}

/**
 * Check if the current node has a style of `overflow:hidden`.
 */
get overflowHidden() {
  return this.style.overflow === "hidden";
}

/**
 * Check if the current node has a style of `overflow:visible`.
 */
get overflowVisible() {
  return this.style.overflow === "visible";
}

/**
 * Check if the current node has a `style.position` property of anything
 * except `static`.
 */
get positionedElement() {
  return !this.positionStatic;
}

/**
 * Check if the current node has a style of `position:absolute`.
 */
get positionAbsolute() {
  return this.style.position === "absolute";
}

/**
 * Check if the current node has a style of `position:relative`.
 */
get positionRelative() {
  return this.style.position === "relative";
}

/**
 * Check if the current node has a style of `position:static`.
 */
get positionStatic() {
  return this.style.position === "static";
}

/**
 * Check if the current node is a pseudo-element with a nodeName with a value
 * inside the values array.
 *
 * @param {Array} values
 *        Array of values to compare against.
 */
pseudoOneOf(values) {
  for (const value of values) {
    if (this.isPseudo(value)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if the current node is a replaced element i.e. an element with
 * content that will be replaced e.g. <img>, <audio>, <video> or <object>
 * elements.
 */
get replaced() {
  // The <applet> element was removed in Gecko 56 so we can ignore them.
  // These are always treated as replaced elements:
  if (this.nodeNameOneOf([
    "br", "button", "canvas", "embed", "hr", "iframe", "math",
    "object", "picture", "svg", "video",
  ])) {
    return true;
  }

  // audio – Treated as a replaced element only when it's "exposing a user
  // interface element" i.e. has a "controls" attribute.
  if (this.nodeName === "audio" && this.getAttribute("controls")) {
    return true;
  }

  // img tags are replaced elements only when the image has finished loading.
  if (this.nodeName === "img" && this.node.complete) {
    return true;
  }

  return false;
}

/**
 * Check if the current node is a ruby annotation.
 */
get rubyAnnotation() {
  return this.style.display === "ruby-text";
}

/**
 * Check if the current node is a ruby annotation container.
 */
get rubyAnnotationContainer() {
  return this.style.display === "ruby-text-container";
}

/**
 * Check if the current node is a ruby base node.
 */
get rubyBase() {
  return this.style.display === "ruby-base";
}

/**
 * Check if the current node is a ruby base container.
 */
get rubyBaseContainer() {
  return this.nodeName === "rbc";
}

// SVG Elements by category, see:
// https://developer.mozilla.org/docs/Web/SVG/Element#SVG_elements_by_category

/**
 * Animation element.
 */
get svgAnimationElement() {
  return this.nodeNameOneOf([
    "animate", "animateColor", "animateMotion", "animateTransform",
    "discard", "mpath", "set",
  ]);
}

/**
 * Basic shape.
 */
get svgBasicShape() {
  return this.nodeNameOneOf([
    "circle", "ellipse", "line", "polygon", "polyline", "rect",
  ]);
}

/**
 * Container element.
 */
get svgContainerElement() {
  return this.nodeNameOneOf([
    "a", "defs", "g", "marker", "mask", "missing-glyph",
    "pattern", "svg", "switch", "symbol", "unknown",
  ]);
}

/**
 * Container element excluding defs.
 */
get svgContainerExcludingDefs() {
  if (this.nodeName === "defs") {
    return false;
  }
  return this.svgContainerElement;
}

/**
 * Descriptive element.
 */
get svgDescriptiveElement() {
  return this.nodeNameOneOf(["desc", "metadata", "title"]);
}

/**
 * Filter primitive element.
 */
get svgFilterPrimitiveElement() {
  return this.nodeNameOneOf([
    "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite",
    "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDropShadow",
    "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur",
    "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset",
    "feSpecularLighting", "feTile", "feTurbulence",
  ]);
}

/**
 * Font element.
 */
get svgFontElement() {
  return this.nodeNameOneOf([
    "font", "font-face", "font-face-format", "font-face-name",
    "font-face-src", "font-face-uri", "hkern", "vkern",
  ]);
}

/**
 * Gradient element.
 */
get svgGradientElement() {
  return this.nodeNameOneOf([
    "linearGradient", "meshgradient", "radialGradient", "stop",
  ]);
}

/**
 * Graphics element.
 */
get svgGraphicsElement() {
  return this.nodeNameOneOf([
    "circle", "ellipse", "image", "line", "mesh", "path",
    "polygon", "polyline", "rect", "text", "use",
  ]);
}

/**
 * Graphics Referencing Element.
 */
get svgGraphicsReferencingElement() {
  return this.nodeNameOneOf(["mesh", "use"]);
}

/**
 * Light source element.
 */
get svgLightSourceElement() {
  return this.nodeNameOneOf(["feDistantLight", "fePointLight", "feSpotLight"]);
}

/**
 * Never rendered element.
 */
get svgNeverRenderedElement() {
  return this.nodeNameOneOf([
    "clipPath", "defs", "hatch", "linearGradient", "marker", "mask",
    "meshgradient", "metadata", "pattern", "radialGradient", "script",
    "style", "symbol", "title",
  ]);
}

/**
 * Paint server element.
 */
get svgPaintServerElement() {
  return this.nodeNameOneOf([
    "hatch", "linearGradient", "meshgradient",
    "pattern", "radialGradient", "solidcolor",
  ]);
}

/**
 * Renderable element.
 */
get svgRenderableElement() {
  return this.nodeNameOneOf([
    "a", "circle", "ellipse", "foreignObject", "g", "image", "line", "mesh",
    "path", "polygon", "polyline", "rect", "svg", "switch", "symbol", "text",
    "textPath", "tspan", "unknown", "use",
  ]);
}

/**
 * Shape element.
 */
get svgShapeElement() {
  return this.nodeNameOneOf([
    "circle", "ellipse", "line", "mesh", "path", "polygon", "polyline", "rect",
  ]);
}

/**
 * Structural element.
 */
get svgStructuralElement() {
  return this.nodeNameOneOf(["defs", "g", "svg", "symbol", "use"]);
}

/**
 * Text content element.
 */
get svgTextContentElement() {
  return this.nodeNameOneOf([
    "altGlyph", "altGlyphDef", "altGlyphItem", "glyph",
    "glyphRef", "textPath", "text", "tref", "tspan",
  ]);
}

/**
 * A text content child element is a text content element that is allowed as a
 * descendant of another text content element. In SVG the text content child
 * elements are: ‘textPath’ and ‘tspan’.
 */
get svgTextContentChildElement() {
  return this.nodeNameOneOf(["textPath", "tspan"]) &&
          (this.node.closest("text") ||
          this.node.closest("textPath") ||
          this.node.closest("tspan"));
}

/**
 * Uncategorized elements.
 */
get svgUncategorizedElement() {
  return this.nodeNameOneOf([
    "clipPath", "color-profile", "cursor", "filter", "foreignObject",
    "hatchpath", "meshpatch", "meshrow", "script", "style", "view",
  ]);
}

/**
 * Check if the current node is a table column.
 */
get table() {
  return this.style.display === "table" ||
          this.style.display === "inline-table";
}

/**
 * Check if the current node is a table cell.
 */
get tableCell() {
  return this.style.display === "table-cell";
}

/**
 * Check if the current node is a tableCaptionBox.
 */
get tableCaptionBox() {
  return this.style.display === "table-caption";
}

/**
 * Check if the current node is a table column.
 */
get tableColumn() {
  return this.style.display === "table-column";
}

/**
 * Check if the current node is a table column group.
 */
get tableColumnGroup() {
  return this.style.display === "table-column-group";
}

/**
 * Check if the current node is a table header.
 */
get tableHeader() {
  return this.nodeName === "th";
}

/**
 * Check if the current node is a table row.
 */
get tableRow() {
  return this.style.display === "table-row";
}

/**
 * Check if the current node is a table row group.
 */
get tableRowGroup() {
  return this.style.display === "table-row-group";
}

/**
 * Check if the current node is transformable. According to the spec a
 * transformable element is an element in one of these categories:
 *
 *   - All elements whose layout is governed by the CSS box model except for
 *     non-replaced inline boxes, table-column boxes, and table-column-group
 *     boxes.
 *   - All SVG paint server elements, the clipPath element and SVG renderable
 *     elements with the exception of any descendant element of text content
 *     elements.
 */
get transformableElement() {
  return (
    !(this.nonReplaced && this.inline) &&
    !this.tableColumn && !this.tableColumnGroup
  ) && (
    this.svgPaintServerElement || this.nodeName === "clipPath" ||
    (this.svgRenderableElement && !this.svgTextContentChildElement)
  );
}
