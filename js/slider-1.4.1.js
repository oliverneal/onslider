/*!
 * JavaScript Picture Slider v1.4.1
 * 
 * Copyright (c) 2013, Oliver Neal 
 * http://www.oliverneal.com/
 *
 * Uses jQuery JavaScript Library
 * http://jquery.com/
 *
 * Licensed under the MIT license
 */

(function($) {
	$.fn.onSlider = function() {
		this.each(function(i,e){
			
			//Variables
			var slides   = [];
			var selected = [];
			var active   = false;
			var first    = 1;
			var last     = 0;
			var current  = 0;
			var length   = 0;
			var width    = 0;
			var counter, slider, sliderImg;
			
			//Setup Slider Container
			$(e).wrapInner('<div class="container">');
			slider = $(e).find('.container');
			sliderImg = $(e).find('.container img');
			
			counter = 1;
			
			sliderImg.each(function(){
				$(this).attr('data-index',counter++);
				length += parseInt($(this).css('width'));
				slides.push($(this));
			});
			
			//Stretch images to match container dimensions as fallback
			sliderImg.css('width', $(e).css('width'));
			sliderImg.css('height', $(e).css('height'));
			
			//Setup Navigation
			if(slides.length > 1){
				setupNavigation();
				
				slides.unshift(slides[slides.length-1].clone());
				slides[first].addClass('selected');
				
				var left = slider.css('left');
				var width = sliderImg.css('width');
				
				slider.css('left', -parseInt(width)+parseInt(left));
				slider.css('width', length+parseInt(width));
				
				showImages(slides);
				matchNavigation();
				
				//Configure automatic slide
				var id = 'canvas-'+i;
				var status = '<canvas id="'+id+'" class="onslider-canvas" width="20px" height="20px"></canvas>';
				slider.before(status);
				
				var clocker, endPI, endingAngle;
				var start = 1.5;
				
				callLoader();
			}
			
			//Canvas Clear
			function reset(){
				window.clearInterval(clocker);
				canvas = document.getElementById(id);
				canvas.height = canvas.height;
				canvas.width = canvas.width;
				start = 1.5;
			}
			
			//Canvas Draw
			function draw(){					
				var canvas = document.getElementById(id);
				var context = canvas.getContext('2d');
				var centerX = canvas.width/2;
				var centerY = canvas.height/2;
				var radius = 10;
				
				var startingAngle = start * Math.PI;
				var counterclockwise = false;
				
				context.lineWidth = 1;
				context.strokeStyle = '#818A8F';
				
				context.beginPath();
				context.moveTo(centerX, centerY);
				context.lineTo(centerX, radius);
				context.closePath();
				
				if(start < 3.5){
					start += 0.020;
					endingAngle = start * Math.PI;
				} else {
					context.beginPath();
					context.clearRect(0,0,canvas.width,canvas.height);
					context.closePath();
					autoSlide();
					return;
				}
				
				context.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
				context.lineTo(centerX, centerY);
				context.stroke();
				context.closePath();
			}
			
			function callLoader(){
				clocker = setInterval(draw, 75);
			}
			
			//Setup Navigation
			function setupNavigation(){
				var imageCount = slides.length;
				var navMenu = '<nav class="onslider-nav"><ul><li><a title="Previous">P</a></li>';
				for(var i = 0; i < imageCount; i++){
					navMenu += '<li><a title="'+(i+1)+'">'+(i+1)+'</a></li>';
				}
				navMenu += '<li><a title="Next">N</a></li></ul></nav>';
				slider.before(navMenu);
				$(e).find('.onslider-nav a').bind('click',navHandler).css({cursor:'pointer'});
			}
			
			function slideNumber(id, array){
				var leftPos = slider.css('left');
				var amount = sliderImg.css('width');
				var current = slider.find('img.selected').attr('data-index');
				var difference = parseInt(id) - parseInt(current);
				var shift = difference*parseInt(amount);
				
				reset();
				
				//Establish Direction
				if(difference < 0){
					var dir = '+='+Math.abs(shift);
				} else if(difference > 0){
					var dir = '-='+shift;
				} else{	}
				
				slides[first].removeClass('selected');
				
				//Multiple Previous Navigations
				if(difference < 0){
					for(var i = 0; i < Math.abs(difference); i++){
						var popped = array.pop();
						array.unshift(popped);
						var cloned = array[array.length-1].clone();
						array[0] = cloned;
					}
					var newPos = shift+parseInt(leftPos);
					slider.css('left', newPos);
					showImages(array);
				}
				
				slider.animate({'left': dir}, 'slow', function(){
					//Mulitple Next Navigations
					if(difference > 0){
						for(var i = 0; i < difference; i++){
							var shifted = array.shift();
							array.push(shifted);
							var cloned = array[0].clone();
							array[array.length-1] = cloned;
						}
					}
					array[first].addClass('selected');
					$(this).css('left', leftPos);
					active = false;
					showImages(array);
					matchNavigation();
					callLoader();
				});
			}
			
			function slideNext(array){
				var leftPos = slider.css('left');
				var amount = sliderImg.css('width');
				reset();					
				slider.animate({'left': '-='+amount}, 'slow', function(){
					var shifted = array.shift();
					array.push(shifted);
					$(this).css('left', leftPos);
					array[first].addClass('selected');
					var cloned = array[0].clone();
					array[array.length-1] = cloned;
					active = false;
					showImages(array);
					matchNavigation();
					callLoader();
				});
			}
				
			function slidePrev(array){
				var leftPos = slider.css('left');
				var amount = sliderImg.css('width');
				reset();					
				slider.animate({'left': '+='+amount}, 'slow', function(){
					var popped = array.pop();
					array.unshift(popped);
					$(this).css('left', leftPos);
					array[first].addClass('selected');
					var cloned = array[array.length-1].clone();
					array[0] = cloned;
					active = false;
					showImages(array);
					matchNavigation();
					callLoader();
				});
			}
			
			function showImages(array){
				slider.empty();
				for(var i = 0; i < array.length; i++){
					slider.append(array[i]);
				}
			}
			
			function matchNavigation(){
				var selected = slider.find('img.selected').attr('data-index');
				$(e).find('.onslider-nav ul li a').each(function(){
					var obj = $(this);
					if(obj.attr('title') == selected){
						obj.parent().addClass('selected');
						obj.addClass('selected');
					} else if(obj.parent().hasClass('selected')){
						obj.parent().removeClass('selected');
						obj.removeClass('selected');
					} else {}
				});
			}
			
			function autoSlide(){
				if(!active){
					active = true;
					slides[first].removeClass('selected');
					slideNext(slides);
				}
			}

			function navHandler(event){
				if(!active){
					var id = $(this).attr('title');
					active = true;
					switch(id){
						case 'Previous':
							slides[first].removeClass('selected');
							slidePrev(slides);
							break;
						case 'Next':
							slides[first].removeClass('selected');
							slideNext(slides);
							break;
						default:
							if(id == slider.find('img.selected').attr('title')){}
							else{ slideNumber(id, slides); }
							break;
					}
				}
			}
		});
	}
})(jQuery);