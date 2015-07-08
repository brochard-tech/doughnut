/**
 * Created by MyVertigo on 29/06/2015.
 * Copyright 2014 - 2015 Christophe Brochard
 * Licensed under Creative Commons Attribution 4.0 International License. 
 */

(function($) {

    var Doughnut = {
        /* ATTRIBUTES */
        size: 80,
        segmentSize: 6,

        fontColor: "white",
        foregroundColor: '#181516',

        animated: false,
        duration: 3000,
        valueDisplayed: null,      // If valueDisplayed !== 0, this value will be displayed on the middle of the circle

        showTotalValue: true,
        showLabelValue: true,

        // If there is only one segment
        value: 0,
        maxValue: null,
        color: "#3CB4F0",
        name: null,
        unit: '',
        textPos: 'auto',  // Alignement of the text (auto, bottom, top, left or right)

        // If they are multiple segments [{ value, color, name }]
        segments: null,

        _canvas: null,
        _total: 0,
        _step: 0,
        _currentSegmentValue: 0,
        _currentSegment: 0,
        _valueDisplayed: false,

        // TODO -> type : percent, 

        /* CONFIGURATION */
        init: function($parent, prop){
            // Merge of properties
            for(var i in prop)
                this[i] = prop[i];

            this.$parent = $parent;

            // Creation of the canvas
            this._canvas = document.createElement('canvas');
            this.$parent.css('position', 'relative');
            $(this._canvas).attr('width', this.size);
            $(this._canvas).attr('height', this.size);
            $(this._canvas).css({
                width:          this.size,
                height:         this.size,
                position:       "absolute",
                left:           "50%",
                'margin-left':  (-this.size/2) + "px"
            });

            this.$parent.html(this._canvas);
            this.$parent.height(this.size);

            this.initDraw();

            if(this.segments){
                this.determineTotalValue();
            }else{
                this.maxValue = this.maxValue == null ? this.value : this.maxValue;
                this._total = this.maxValue;
            }

            return this;
        },

        // Reinitialization of all element
        reinit: function(){
            this._currentSegmentValue = 0;
            this._valueDisplayed = false;
            this._currentSegment = 0;

            this.clearDraw();
            this.$parent.find('.doughnut-values').remove();
        },

        // Launch animation
        animate: function(){
            this.reinit();

            var doug = this;
            switch(this.animated){
                case true:
                    this.$parent.prop('Angle', 0).animate({
                        Angle: doug.getMaxAngle()
                    }, {
                        duration: doug.duration,
                        queue: false,
                        step: function(now){
                            doug.draw(Math.ceil(now));
                        }
                    });
                    break;

                default: this.draw();
                    break;
            }
        },

        // Determine ratio and total values
        determineTotalValue: function(){
            this._total = 0;
            this._currentValue = 0;

            for(var i = 0; i < this.segments.length; i++){
                var segment = this.segments[i];
                this._total += parseInt(segment.value || 0);
            }
        },

        // Get segment with step
        getStepSegment: function(step){
            var maxAngle = 360;

            // If there are multiple segments
            if(this.segments){
                var currentSegment = this.segments[this._currentSegment];

                if(currentSegment){
                    var currentSegmentMaxValue = this._currentSegmentValue + (currentSegment.value / this._total) * maxAngle;
                    var currentValue = (step / maxAngle) * maxAngle;

                    if(currentValue > currentSegmentMaxValue) {
                        this._currentSegmentValue = currentSegmentMaxValue;
                        currentSegment = this.segments[++this._currentSegment];
                    }
                }
            }

            return currentSegment;
        },

        // Get context of canvas
        getContext: function(){
            if(!this.ctx)
                this.ctx = this._canvas.getContext('2d');

            return this.ctx;
        },

        // Display values of segments outside the canvas
        displayValues: function(){
            var offset = 0;

            for(var i = 0; i < this.segments.length; i++){
                var segment = this.segments[i];
                this.displayValue(segment, offset);

                offset += (segment.value / this._total) * 360;
            }

        },

        displayValue: function(segment, offset){
            // Determine angle en coordinate
            var size = this.size / 2;
            var angle = (segment.value / this._total) * 360;
            var currentAngle = ((offset || 0) + (angle / 2));

            switch(segment.textPos){
                case 'top':
                    var x = 0;
                    var y = -size;
                    var offsetX = 0.5;
                    var offsetY = 1;
                    break;

                case 'bottom':
                    var x = 0;
                    var y = size;
                    var offsetX = 0.5;
                    var offsetY = 0;
                    break;

                case 'left':
                    var x = -size;
                    var y = 0;
                    var offsetX = 1;
                    var offsetY = 0.5;
                    break;

                case 'right':
                    var x = size;
                    var y = 0;
                    var offsetX = 0;
                    var offsetY = 0.5;
                    break;

                default:
                    var x = Math.floor(Math.cos(this.getRadians(currentAngle -90)) * size);
                    var y = Math.floor(Math.sin(this.getRadians(currentAngle -90)) * size);

                    var offsetX = 0.5;
                    var offsetY = 0.5;

                    if(x < 0)       offsetX = 1;
                    else if(x > 0)  offsetX = 0;

                    if(y < 0)       offsetY = 1;
                    else if(y > 0)  offsetY = 0;
                    break;
            }

            this.displayValueByPos(segment, x, y, offsetX, offsetY);
            this._valueDisplayed = true;
        },

        displayValueByPos: function(segment, x, y, offsetX, offsetY){
            if(!segment.value || !this.showLabelValue || !segment.name)
                return false;

            var element = document.createElement('div');
            var size = this.size / 2;

            // Creation of HTML values and names
            element.className = "doughnut-values";
            element.style.display = "inline-block";
            element.innerHTML = "<span class='doughnut-value'>" + (segment.value || 0).toString() + " " + this.unit + "</span><br /><span class='doughnut-name'>" + (segment.name || "") + "</span>";

            // Css for element
            $(element).css({
                opacity: 0,
                left: '50%',
                position:   "absolute",
                'text-align': "center"
            });

            this.$parent.append(element);
            offsetX = $(element).width() * offsetX;
            offsetY = $(element).height() * offsetY;

            // Replacement of the element arround the circle
            $(element).css({
                'margin-left':  (x - offsetX) + "px",
                top:            (size + y - offsetY) + "px"
            });

            // Fade animation
            $(element).animate({
                opacity: 1
            }, 300);
        },

        // Convert degree to radians
        getRadians: function(degrees){
            return degrees * Math.PI / 180;
        },

        // Get max angle (usefull when you have only one segment and it does not go all arround the circle
        getMaxAngle: function(){
            if(this.segments && this.segments.length) {
                return 360;

            }else{
                var value = Math.floor((this.value / this.maxValue) * 360);
                return value;

            }
        },


        /* DRAW */
        initDraw: function(step){
            var ctx = this.getContext();
            var middle = this.size  / 2;
            var radius = middle - this.segmentSize;

            this.clearDraw();

            // Draw the foreground
            ctx.beginPath();
            ctx.fillStyle = this.foregroundColor;
            ctx.arc(middle, middle, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

            // Cancel draw if animated is launched manualy
            if(this.animated == "delay" || !this.showTotalValue)
                return false;

            var total = 0;
            if(this.valueDisplayed !== null)
                total = this.valueDisplayed;
            else
                total = this.segments ? this._total.toString() : this.value.toString();

            var value = total;
            if(step !== undefined){
                value = Math.floor((step / this.getMaxAngle()) * total).toString();
                value = isNaN(value) ? 0 : value;
            }

            // Draw the total value
            ctx.font = "25px Arial";
            ctx.fillStyle = this.fontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(value, middle - (this.segmentSize / 4), middle - (this.segmentSize / 4));
        },

        // Clear canvas
        clearDraw: function(){
            var ctx = this.getContext();
            ctx.clearRect(0, 0, this.size, this.size);
        },

        draw: function(step){
            if(!this._canvas) return false;
            this.initDraw(step);

            var withStep = step !== undefined;

            // Cancel draw if animated is launched manualy
            if(this.animated == "delay")
                return false;

            // Only one segment
            if(!this.segments){
                var segment = { color: this.color, value: this.value, name: this.name, textPos: this.textPos };
                this.drawSegment(0, segment, step);

                if(step == this.getMaxAngle() && !this._valueDisplayed) {
                    this.displayValue(segment);
                }

            // Multiple segments
            }else{
                var angle = 0;
                var stepSegment = withStep ? this.getStepSegment(step) : null;

                for(var i = 0; i < (withStep ? this._currentSegment : this.segments.length); i++){
                    var segment = this.segments[i];
                    var ratio = (segment.value / this._total) * 360;

                    this.drawSegment(angle, segment);
                    angle += ratio;
                }

                if(withStep && stepSegment) {
                    this.drawSegment(this._currentSegmentValue, stepSegment, step);

                    if(step == 360 && !this._valueDisplayed)
                        this.displayValues();
                }

            }

            if(!withStep){
                if(!this.segments)
                    this.displayValue(segment);
                else
                    this.displayValues();
            }
        },

        // Draw a segment passed by parameter
        drawSegment: function(angle, segment, step){
            var ctx = this.getContext();
            var maxAngle = 360;
            var ratio = (segment.value / this._total) * maxAngle;
            var radius = (this.size / 2) - (this.segmentSize / 2);
            var offset = step !== undefined ? ratio + angle - step : 0;

            ctx.beginPath();
                ctx.lineWidth = this.segmentSize;
                ctx.strokeStyle = segment.color || '#3CB4F0';
                ctx.arc(this.size / 2, this.size / 2, radius, this.getRadians(angle - 90), this.getRadians(angle + ratio - 90 - (offset <= 0 ? 0 : offset)));
                ctx.stroke();
            ctx.closePath();
        }
    };



    $.fn.doughnut = function(prop){
        if(prop !== "animate"){
            prop = prop || {};
            var doug = Object.create(Doughnut);
            var duration = prop.duration || 3000;

            doug.init(this, prop);
            $(this).prop('doug', doug);

            doug.animate();
        }else{
            var doug = $(this).prop('doug');

            if(doug.animated){
                doug.animated = true;
                doug.animate();
            }
        }
    };
})( jQuery );