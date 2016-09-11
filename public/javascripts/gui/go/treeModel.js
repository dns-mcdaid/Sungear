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
		return node.isLeaf();
	},
	valueForPathChanged : function(path, newValue) {
		
	},
	addTreeModelListener : function(l) {
		
	},
	removeTreeModelListener : function(l) {
		
	},
	/**
	 * Returns the index of child in parent.
	 * If either parent or child is null, returns -1.
	 * If either parent or child don't belong to this tree model, returns -1.
	 *
	 * @param parent {TreeNode}
	 * @param child {TreeNode}
	 * @returns {Number}
	 */
	getIndexOfChild : function(parent, child) {
		return parent.getIndex(child);
	},
	
	/**
	 * Invoked this to insert newChild at location index in parents children.
	 * This will then message nodesWereInserted to create the appropriate event.
	 * This is the preferred way to add children as it will create the appropriate event.
	 *
	 * @param newChild {TreeNode}
	 * @param parent {TreeNode}
	 * @param index {Number}
	 */
	insertNodeInto : function(newChild, parent, index) {
		parent.insert(newChild, index);
		this.nodesWereInserted(parent, [ index ]);
	},
	/**
	 * Message this to remove node from its parent.
	 * This will message nodesWereRemoved to create the appropriate event.
	 * This is the preferred way to remove a node as it handles the event creation for you.
	 *
	 * @param node {TreeNode}
	 */
	removeNodeFromParent : function(node) {
		const parentInfo = node.removeFromParent();
		this.nodesWereRemoved(parentInfo.parent, [ parentInfo.index ], [ node ]);
	},
	/**
	 * Invoke this method after you've changed how node is to be represented in the tree.
	 * @param node {TreeNode}
	 */
	nodeChanged : function(node) {
		// TODO: Implement me.
	},
	/**
	 * Invoke this method if you've modified the TreeNodes upon which this model depends.
	 * The model will notify all of its listeners that the model has changed below the given node.
	 * @param node {TreeNode}
	 */
	reload : function(node) {
		// TODO: Implement me.
	},
	nodesWereInserted : function(node, childIndices) {
		// TODO: Implement me.
	},
	/**
	 * Invoke this method after you've removed some TreeNodes from node.
	 * childIndices should be the index of the removed elements and must be sorted in ascending order.
	 * And removedChildren should be the array of the children objects that were
	 *
	 * @param node {TreeNode}
	 * @param childIndices {Array} of Numbers
	 * @param removedChildren {Array} of Objects
	 */
	nodesWereRemoved : function(node, childIndices, removedChildren) {
		
	},
	/**
	 * Sets the root to root.
	 * This will throw an * IllegalArgumentException if root is null.
	 * @param aRoot {TreeNode}
	 */
	setRoot : function(aRoot) {
		this.root = aRoot;
	}
};

module.exports = TreeModel;