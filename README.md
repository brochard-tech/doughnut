## Synopsis

jQuery.Doughnut is a super-simple plugin for create doughnut animated with multiple values. To construct a doughnut, this plugin needs the HTML5 canvas tag so be sure to have a navigator up-to-date.

## Demo

[Click here to see a demo](http://www.myvertigo.fr/portfolio/plugins/doughnut/example/).

## Installation

* In first, you will need [the jQuery Plugin](https://jquery.com/)
* Then, just add the jQuery.doughnut.js or jQuery.doughnut.min.js just after jQuery like this :
```javascript
<script type="text/javascript" src="jquery.doughnut.min.js"></script>
```
After that, the plugin will be ready to use.

## How to use it

* First of all, you need to create a div like this
```javascript
<div id="your_id"></div>   
```
* Then, after the div or in your JS files, you need to add this :
```javascript
$('#your_id').doughnut({
    value: 5,
    color: 'deepskyblue'
});
```
That's all ! You will see a beautiful doughnut inside the div.

## Customization

jQuery.Doughnut implements a list of parameters for customization :
* **size** *(int)*: diameter of the doughnut
* **segmentSize** *(int)*: lineWidth of segment
* **fontColor** *(string)*: Color of font in the circle
* **foregroundColor** *(string)*: Color of the circle
* **animated** *(boolean | string)*: set animation for the doughnut (use "delay" to launch the animation manually)
* **duration** *(int)*: duration of the animation in ms.
* **valueDisplay** *(int)*: display a specific value into the center of the circle
* **showTotalValue** *(boolean)*: show or hide the value into the center of the circle
* **showLabelValue** *(boolean)*: show or hide the labels for each segments of the circle
* **value** *(int)*: value of the segment (use it if you have only one segment)
* **name** *(string)*: label name of the segment (use it if you have only one segment)
* **color** *(string)*: color of the segment (use it if you have only one segment)
* **textPos** *(string)*: position of the label (top, left, right, bottom or auto (default)) (use it if you have only one segment)
* **maxValue** *(int)*: use maxValue if you do not want the segment fill all the circle (use it if you have only one segment)
* **segments** *(Array)*: use this if you want multiple segments. Each segment implements the segments attributes. For example :
```javascript
segments: [
    { value: 5, color: 'deepskyblue', name: 'tomatoes', textPos: 'auto' }, // By default, the textPos is 'auto'
    { value: 13, color: 'firebrick', name: 'bananas' },
    { value: 2, color: 'yellow' } // Minimum attribute required to create a segment
]
```

# Animation delayed

It is possible to manually launch the animation of the doughnut. To proceed, you need to set animation to "delay". When you want to launch the animation, you just need to do this :
```javascript
$('#your_doughnut_id').doughnut('animate');
```
Be careful ! You must declare a doughnut with attributes before us doughnut('animate').

## License

This plugin is licensed under Creative Commons Attribution 4.0 International License. 