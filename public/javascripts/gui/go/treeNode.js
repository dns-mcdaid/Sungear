"use strict";
/**
 * New Implementation of Java's DefaultMutableTreeNode
 *
 * @author RajahBimmy
 */

function TreeNode(object = null, allowsChildren = true) {
	this.allowsChildren = allowsChildren;
	//noinspection JSUnresolvedVariable
	this.children = []; /** {TreeNode} children  */
	this.userObject = object;
	this.parent = null;
	this.collapsed = false;
}

TreeNode.prototype = {
	constructor : TreeNode,
	/**
	 * Returns the child at the specified index in this node's child array.
	 * @param index {Number} an index into this node's child array
	 * @returns {TreeNode} in this node's child array at the specified index
	 */
	getChildAt : function(index) {
		return this.children[index];
	},
	/**
	 * @returns {Number} Returns the number of children TreeNodes the receiver contains.
	 */
	getChildCount : function() {
		return this.children.length;
	},
	/**
	 * Returns the parent TreeNode of the receiver.
	 * @returns {null|object}
	 */
	getParent : function() {
		return this.parent;
	},
	/**
	 * Returns the index of node in the receivers children.
	 * If the receiver does not contain node, -1 will be returned.
	 * @param node {TreeNode}
	 * @returns {Number}
	 */
	getIndex : function(node) {
		return this.children.indexOf(node);
	},
	/**
	 * Returns true if the receiver allows children.
	 * @returns {boolean}
	 */
	getAllowsChildren : function() {
		return this.allowsChildren;
	},
	/**
	 * Returns true if the receiver is a leaf.
	 * @returns {boolean}
	 */
	isLeaf : function() {
		return this.children.length === 0;
	},
	/**
	 * Adds child to the receiver at index.
	 * child will be messaged with setParent.
	 *
	 * @param child {object}
	 * @param index {Number} optional
	 */
	insert : function(child, index) {
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
	getUserObject : function() {
		return this.userObject;
	},
	/**
	 * Resets the user object of the receiver to object.
	 *
	 * Only useful in the restrictive communist Java language.
	 * #fuckStaticallyTypedLanguages
	 */
	setUserObject : function(obj) {
		this.userObject = obj;
	},
	removeFromParent : function() {
		const oldParent = this.parent;
		const index = oldParent.children.indexOf(this);
		this.parent = null;
		return {
			parent : oldParent,
			index : index
		};
	},
	setParent : function(newParent) {
		this.parent = newParent;
	},
	/**
	 * Removes newChild from its parent and makes it a child of this node by adding it to the end of this node's child array.
	 * @param newChild {TreeNode}
	 */
	add : function(newChild) {
		if (newChild !== null) {
			newChild.setParent(this);
			this.children.push(newChild);
		}
	},
	/**
	 * Returns the path from the root, to get to this node. The last element in the path is this node.
	 * @returns {Array.<*>}
	 */
	getPath : function() {
		const path = [];
		let parent = this;
		while (parent !== null) {
			path.push(parent);
			parent = parent.getParent();
		}
		return path.reverse();
	},
	postorderEnumeration : function() {
		let myStack = [];
		myStack.push(this);
		this.children.forEach((child) => {
			myStack = myStack.concat(child.postorderEnumeration());
		});
		return myStack.reverse();
	},
	/**
	* Queries if this Tree Node is currently represented in a collapsed or expanded state
	*/
	isCollapsed : function(){
		return this.userObject.isCollapsed();
	},
	/**
	* Sets the collapsed state of the Tree Node
	* @param {Boolean} b true if collapsed, false if expanded
	*/
	setCollapsed : function(b){
		this.userObject.setCollapsed(b);
	}
};

module.exports = TreeNode;
