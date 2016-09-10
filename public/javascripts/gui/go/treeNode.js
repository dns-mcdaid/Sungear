"use strict";
/**
 * New Implementation of Java's MutableTreeNode
 *
 * @author RajahBimmy
 */

function TreeNode(data) {
	this.parent = null;
	this.data = data;
	this.children = []; /** {Array} */
}

TreeNode.prototype = {
	constructor : TreeNode,
	/**
	 * Adds child to the receiver at index.
	 * child will be messaged with setParent.
	 *
	 * @param child {object}
	 * @param index {number} optional
	 */
	push : function(child, index) {
		if (typeof index === 'undefined') {
			this.children.push(child);
		} else {
			this.children.splice(index, 0, child);
		}
		child.setParent(this);
	},
	/**
	 * Removes the child at index from the receiver.
	 * OR
	 * Removes node from the receiver. setParent will be messaged on node.
	 *
	 * @param item {number|object}
	 */
	remove : function(item) {
		let index = 0;
		if (typeof item === 'number') {
			index = item;
		} else {
			index = this.children.indexOf(item);
		}
		if (index < this.children.length && index > -1) {
			this.children[index].removeFromParent();
			this.children.splice(index, 1);
		}
	},
	/**
	 * Resets the user object of the receiver to object.
	 *
	 * Only useful in the restrictive communist Java language.
	 * #fuckStaticallyTypedLanguages
	 */
	setUserObject : function() {
		console.log("Hello! This function is useless.");
	},
	removeFromParent : function() {
		this.parent = null;
	},
	setParent : function(newParent) {
		this.parent = newParent;
	}
};

module.exports = TreeNode;