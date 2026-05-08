<?php
/**
 * Script dependencies for the block editor.
 *
 * This file is used automatically by WordPress when block.json uses:
 * "editorScript": "file:./index.js"
 */

return [
	'dependencies' => [
		'wp-blocks',
		'wp-element',
		'wp-components',
		'wp-block-editor',
		'wp-data',
		'wp-editor',
	],
	'version'      => filemtime(__DIR__ . '/index.js'),
];

