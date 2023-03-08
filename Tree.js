const Node = require('./Node');

class Tree {
    constructor(arr) {
        this.root = this.buildTree(arr);
    }

    prepArray(arr) {
        return [...new Set(arr)].sort((a,b) => a - b);
    }

    buildTree(arr) {
        if (arr.length == 0) return null;
        arr = this.prepArray(arr);
        let mid = Math.floor(arr.length/2);
        let root = new Node(
            arr[mid], 
            this.buildTree(arr.slice(0, mid)),
            this.buildTree(arr.slice(mid+1)));

        return root;
    }

    insert(value, node = this.root) {
        if (node == null) return new Node(value);

        if (value < node.data) {
            node.left = this.insert(value, node.left);
        } else if (value > node.data) {
            node.right = this.insert(value, node.right);
        } else if (value == node.data) {
            return "This value already exists in the tree.";
        }

        return node;
    }

    minValue(node) {
        let minv = node.data;
        while (node.left) {
            minv = node.left.data;
            node = node.left;
        }
        return minv;
    }

    delete(value, node = this.root) {
        if (node == null) return node;

        if (value < node.data) {
            node.left = this.delete(value, node.left);
        } else if (value > node.data) {
            node.right = this.delete(value, node.right);
        } else {
            //node with 1 or no children
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            
            //node with 2 children (get the smallest in right subtree and delete)
            node.data = this.minValue(node.right);
            node.right = this.delete(node.right, node.key);

        }

        return node;
    }

    find(value, node = this.root) {
        if (node == null) return "Node not found.";
        if (node.data == value) return node;

        if (value < node.data) return this.find(value, node.left);
        if (value > node.data) return this.find(value, node.right);
    }


    levelOrder(callbackFn) {
        let traversed = [this.root];
        let first = this.root;
        let output = [];
        while (traversed.length > 0) {
            first = traversed.shift();
            callbackFn ? callbackFn(first) : output.push(first.data);
            if (first.left) traversed.push(first.left);
            if (first.right) traversed.push(first.right);
        }

        if (!callbackFn) return output;
    }

    preorder(callbackFn, node = this.root, nodes = []) {
        if (node == null) return;

        callbackFn ? callbackFn(node) : nodes.push(node.data);
        this.preorder(callbackFn, node.left, nodes);
        this.preorder(callbackFn, node.right, nodes);

        if(!callbackFn) return nodes;
    }


    inorder(callbackFn, node = this.root, nodes = []) {
        if (node == null) return;

        this.inorder(callbackFn, node.left, nodes);
        callbackFn ? callbackFn(node) : nodes.push(node.data);
        this.inorder(callbackFn, node.right, nodes);

        if(!callbackFn) return nodes;
    }

    postorder(callbackFn, node = this.root, nodes = []) {
        if (node == null) return;

        this.postorder(callbackFn, node.left, nodes);
        this.postorder(callbackFn, node.right, nodes);
        callbackFn ? callbackFn(node) : nodes.push(node.data);

        if(!callbackFn) return nodes;
    }

    height(node) {
        if (node == null) return -1;

        let leftHeight = this.height(node.left);
        let rightHeight = this.height(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(node, level = 0) {
        if (node.data == this.root.data) {
            return level;
        } else if(node.data < this.root.data) {
            level++;
            this.depth(node.left, level);
        } else if (node.data > this.root.data) {
            level++;
            this.depth(node.right, level);
        }
    }

    isBalanced() {
        //if height of left and right differ by 1
        let leftSubTree = this.height(this.root.left);
        let rightSubTree = this.height(this.root.right);

        if (Math.abs(leftSubTree - rightSubTree) <= 1) return true;

        return false;
    }

    rebalance() {
        this.root = this.buildTree(this.inorder());
    }
}

module.exports = Tree;