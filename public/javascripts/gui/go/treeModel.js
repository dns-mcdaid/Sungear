"use strict";
/**
 * TODO: Implement
 * @author RajahBimmy
 */
const SortedSet = require('collections/sorted-set');
const TreeNode = require('./treeNode');


function TreeModel(root = null) {
	if (root === null) {
		this.root = null;
	} else {
		this.root = new TreeNode(root);
	}
}

TreeModel.prototype = {
	constructor : TreeModel,
	/**
	 * Returns the root of the tree. Returns null only if the tree has no nodes.
	 *
	 * @returns {TreeNode|null}
	 */
	getRoot : function() {
		return this.root;
	},
	/**
	 * Returns the child of parent at index index in the parent's child array.
	 * parent must be a node previously obtained from this data source.
	 * This should not return null if index is a valid index for parent (that is index >= 0 && index < getChildCount(parent)).
	 *
	 * @param parent {TreeNode}
	 * @param index {number}
	 */
	getChild : function(parent, index) {
		if (index <= 0 && index < parent.children.length) {
			return parent.children[index];
		} else {
			return null;
		}
	},
	/**
	 * Returns the number of children of parent.
	 * Returns 0 if the node is a leaf or if it has no children.
	 * parent must be a node previously obtained from this data source.
	 *
	 * @param parent {TreeNode}
	 * @returns {number}
	 */
	getChildCount : function(parent) {
		return parent.children.length;
	},
	/**
	 * Returns true if node is a leaf. It is possible for this method to return false even if node has no children. A directory in a filesystem, for example, may contain no files; the node representing the directory is not a leaf, but it also has no children.
	 *
	 * @param node {TreeNode}
	 * @returns {boolean}
	 */
	isLeaf : function(node) {
		return node.children.length == 0;
	},
	/**
	 * "Invoked this to insert newChild at location index in parents children.
	 * This will then message nodesWereInserted to create the appropriate event.
	 * This is the preferred way to add children as it will create the appropriate event."
	 * -Oracle (what a bunch of scrubs)
	 *
	 * @param newChild {TreeNode}
	 * @param parent {TreeNode}
	 * @param index {Number}
	 */
	insertNodeInto : function(newChild, parent, index) {
		
	}
};

module.exports = TreeModel;