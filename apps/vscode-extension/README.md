# Restruct

An extension for develpers to write and preview the architecture models and diagrams using structurizr workspace structure.

## Features

The preview extension has the following features:

- System Landscape, Container, Component, Model and Deployment view rendering
- Auto layout for every view
- Navigation between levels using breadcrumbs
- Navigation between view default, model, and deployment view types.
- Navigation using zoom in and zoom out buttons on element hover.

## Requirements

No specific requirements, other than working with files that have language set as 'structurizr'.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

The extension ins curently in pre-release and has several known bugs:

- Sometimes the view is not rendered when opened the preview until file changes.
- The deployment view has a broken auto layout.
- Currently there is no way to navigate to System Context view.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

Initial release of Structurizr Preview extension.
