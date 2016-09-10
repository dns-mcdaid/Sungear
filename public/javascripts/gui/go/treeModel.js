"use strict";
/**
 * TODO: Implement
 * @author RajahBimmy
 */
const SortedSet = require('collections/sorted-set');


function TreeModel(root = null) {
	if (root === null) {
		this.root = null;
	} else {
		this.root = new TreeNode(root);
	}
}

TreeModel.prototype = {
	constructor : TreeModel,
	
};


function TreeNode(data) {
    this.data = data;
    this.children = new SortedSet();
}

TreeNode.prototype = {
    constructor : TreeNode,
    addChild : function(node) {
    	this.children.push(node);
    },
    contains : function(node) {
    	return this.children.contains(node);
    }
};

module.exports = TreeModel;