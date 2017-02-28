(function ($, window) {

	"use strict";

	var carousel = {

		init: function (options) {

			var defaults = {
				duration: 200, // ms animation duration
				dist: -100, // zoom scale todo: make this more intuitive as an option
				shift: 0, // spacing for center image
				padding: 0, // Padding between non center items
				fullWidth: false, // Change to full width styles
				indicators: false, // Toggle indicators
				nowrap: false, // Don't wrap around and cycle through items.
				autoSlide: false, // Don't Carousel automatically 
				autoSlideTime: 4000 //Slide duration
			};

			options = $.extend(defaults, options || {});

			return this.each(function () {

				var images, offset, center, pressed, dim, count, item_width,
					reference, referenceY, amplitude, target, velocity, y,
					xform, frame, timestamp, ticker, dragged, vertical_dragged, tweenedOpacity, zTranslation;
				var $indicators = $('<ul class="indicators"></ul>');

				// Initialize
				var view = $(this);
				var showIndicators = view.attr('data-indicators') || options.indicators;

				// Don't double initialize.
				if (view.hasClass('initialized')) {
					$(this).trigger('carouselNext', [0.000001]);
					return true;
				}


				// Options
				if (options.fullWidth) {
					options.dist = 0;
					var firstImage = view.find('.carousel-item img').first();
					var imageHeight;
					if (firstImage.length) {
						imageHeight = firstImage.height();
						view.css('height', imageHeight);
					} else {
						imageHeight = view.find('.carousel-item').first().height();
						view.css('height', imageHeight);
					}

					if (showIndicators) {
						view.find('.carousel-fixed-item').addClass('with-indicators');
					}
				}


				view.addClass('initialized');
				pressed = false;
				offset = target = 0;
				images = [];
				item_width = view.find('.carousel-item').first().innerWidth();
				dim = item_width * 2 + options.padding;

				view.find('.carousel-item').each(function (i) {
					images.push($(this)[0]);
					if (showIndicators) {
						var $indicator = $('<li class="indicator-item"></li>');

						if (i === 0) {
							$indicator.addClass('active');
						}

						$indicator.click(function () {
							var index = $(this).index();
							cycleTo(index);
						});
						$indicators.append($indicator);
					}
				});

				if (showIndicators) {
					view.append($indicators);
				}
				count = images.length;


				function setupEvents() {
					if (typeof window.ontouchstart !== 'undefined') {
						view[0].addEventListener('touchstart', tap);
						view[0].addEventListener('touchmove', drag);
						view[0].addEventListener('touchend', release);
					}
					view[0].addEventListener('mousedown', tap);
					view[0].addEventListener('mousemove', drag);
					view[0].addEventListener('mouseup', release);
					view[0].addEventListener('mouseleave', release);
					view[0].addEventListener('click', click);
				}

				function xpos(e) {
					// touch event
					if (e.targetTouches && (e.targetTouches.length >= 1)) {
						return e.targetTouches[0].clientX;
					}

					// mouse event
					return e.clientX;
				}

				function ypos(e) {
					// touch event
					if (e.targetTouches && (e.targetTouches.length >= 1)) {
						return e.targetTouches[0].clientY;
					}

					// mouse event
					return e.clientY;
				}

				function wrap(x) {
					return (x >= count) ? (x % count) : (x < 0) ? wrap(count + (x % count)) : x;
				}

				function scroll(x) {
					var i, half, delta, dir, tween, el, alignment, xTranslation;

					offset = (typeof x === 'number') ? x : offset;
					center = Math.floor((offset + dim / 2) / dim);
					delta = offset - center * dim;
					dir = (delta < 0) ? 1 : -1;
					tween = -dir * delta * 2 / dim;
					half = count >> 1;

					if (!options.fullWidth) {
						alignment = 'translateX(' + (view[0].clientWidth - item_width) / 2 + 'px) ';
						alignment += 'translateY(' + (view[0].clientHeight - item_width) / 2 + 'px)';
					} else {
						alignment = 'translateX(0)';
					}

					// Set indicator active
					if (showIndicators) {
						var diff = (center % count);
						var activeIndicator = $indicators.find('.indicator-item.active');
						if (activeIndicator.index() !== diff) {
							activeIndicator.removeClass('active');
							$indicators.find('.indicator-item').eq(diff).addClass('active');
						}
					}

					// center
					
					if (!options.nowrap || (center >= 0 && center < count)) {
						el = images[wrap(center)];
						el.style[xform] = alignment +
							' translateX(' + (-delta / 2) + 'px)' +
							' translateX(' + (dir * options.shift * tween * i) + 'px)' +
							' translateZ(' + (options.dist * tween) + 'px)';
						el.style.zIndex = 0;
						if (options.fullWidth) {
							tweenedOpacity = 1;
						} else {
							tweenedOpacity = 1 - 0.2 * tween;
						}
						el.style.opacity = tweenedOpacity;
						el.style.display = 'block';
					}

					for (i = 1; i <= half; ++i) {
						// right side
						if (options.fullWidth) {
							zTranslation = options.dist;
							tweenedOpacity = (i === half && delta < 0) ? 1 - tween : 1;
						} else {
							zTranslation = options.dist * (i * 2 + tween * dir);
							tweenedOpacity = 1 - 0.2 * (i * 2 + tween * dir);
						}
						if (!options.nowrap || center + i < count) {
							el = images[wrap(center + i)];
							el.style[xform] = alignment +
								' translateX(' + (options.shift + (dim * i - delta) / 2) + 'px)' +
								' translateZ(' + zTranslation + 'px)';
							el.style.zIndex = -i;
							el.style.opacity = tweenedOpacity;
							el.style.display = 'block';
						}


						// left side
						if (options.fullWidth) {
							zTranslation = options.dist;
							tweenedOpacity = (i === half && delta > 0) ? 1 - tween : 1;
						} else {
							zTranslation = options.dist * (i * 2 - tween * dir);
							tweenedOpacity = 1 - 0.2 * (i * 2 - tween * dir);
						}
						
						if (!options.nowrap || center - i >= 0) {
							el = images[wrap(center - i)];
							el.style[xform] = alignment +
								' translateX(' + (-options.shift + (-dim * i - delta) / 2) + 'px)' +
								' translateZ(' + zTranslation + 'px)';
							el.style.zIndex = -i;
							el.style.opacity = tweenedOpacity;
							el.style.display = 'block';
						}
					}

					// center
					
					if (!options.nowrap || (center >= 0 && center < count)) {
						el = images[wrap(center)];
						el.style[xform] = alignment +
							' translateX(' + (-delta / 2) + 'px)' +
							' translateX(' + (dir * options.shift * tween) + 'px)' +
							' translateZ(' + (options.dist * tween) + 'px)';
						el.style.zIndex = 0;
						if (options.fullWidth) {
							tweenedOpacity = 1;
						} else {
							tweenedOpacity = 1 - 0.2 * tween;
						}
						el.style.opacity = tweenedOpacity;
						el.style.display = 'block';
					}
				}

				function track() {
					var now, elapsed, delta, v;

					now = Date.now();
					elapsed = now - timestamp;
					timestamp = now;
					delta = offset - frame;
					frame = offset;

					v = 1000 * delta / (1 + elapsed);
					velocity = 0.8 * v + 0.2 * velocity;
				}

				function autoScroll() {
					var elapsed, delta;
					if (amplitude) {
						elapsed = Date.now() - timestamp;
						delta = amplitude * Math.exp(-elapsed / options.duration);
						if (delta > 2 || delta < -2) {
							scroll(target - delta);
							requestAnimationFrame(autoScroll);
						} else {
							scroll(target);
						}
					}
				}


				function click(e) {
					if (dragged) {
						e.preventDefault();
						e.stopPropagation();
						return false;

					} else if (!options.fullWidth) {
						var clickedIndex = $(e.target).closest('.carousel-item').index();
						var diff = (center % count) - clickedIndex;

						if (diff !== 0) {
							e.preventDefault();
							e.stopPropagation();
						}
						cycleTo(clickedIndex);
					}
				}

				function cycleTo(n) {
					var diff = (center % count) - n;

					if (!options.nowrap) {
						if (diff < 0) {
							if (Math.abs(diff + count) < Math.abs(diff)) {
								diff += count;
							}

						} else if (diff > 0) {
							if (Math.abs(diff - count) < diff) {
								diff -= count;
							}
						}
					}

					if (diff < 0) {
						view.trigger('carouselNext', [Math.abs(diff)]);

					} else if (diff > 0) {
						view.trigger('carouselPrev', [diff]);
					}
				}

				function tap(e) {
					pressed = true;
					dragged = false;
					vertical_dragged = false;
					reference = xpos(e);
					referenceY = ypos(e);

					velocity = amplitude = 0;
					frame = offset;
					timestamp = Date.now();
					clearInterval(ticker);
					ticker = setInterval(track, 100);

				}



				function drag(e) {
					var x, delta, deltaY;
					if (pressed) {
						x = xpos(e);
						y = ypos(e);
						delta = reference - x;
						deltaY = Math.abs(referenceY - y);
						if (deltaY < 30 && !vertical_dragged) {
							if (delta > 2 || delta < -2) {
								dragged = true;
								reference = x;
								scroll(offset + delta);
							}

						} else if (dragged) {
							e.preventDefault();
							e.stopPropagation();
							return false;

						} else {
							vertical_dragged = true;
						}
					}

					if (dragged) {
						e.preventDefault();
						e.stopPropagation();
						return false;
					}
				}

				function release(e) {
					if (pressed) {
						pressed = false;
					} else {
						return;
					}

					clearInterval(ticker);
					target = offset;

					if (velocity > 10 || velocity < -10) {
						amplitude = 0.9 * velocity;
						target = offset + amplitude;
					}
					target = Math.round(target / dim) * dim;

					// No wrap of items.
					if (options.nowrap) {
						if (target >= dim * (count - 1)) {
							target = dim * (count - 1);
						} else if (target < 0) {
							target = 0;
						}
					}
					amplitude = target - offset;
					timestamp = Date.now();
					requestAnimationFrame(autoScroll);

					if (dragged) {
						e.preventDefault();
						e.stopPropagation();
					}
					return false;
				}

				xform = 'transform';
				['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
					var e = prefix + 'Transform';
					if (typeof document.body.style[e] !== 'undefined') {
						xform = e;
						return false;
					}
					return true;
				});

				window.onresize = scroll;

				setupEvents();
				scroll(offset);

				$(this).on('carouselNext', function (e, n) {
					if (n === undefined) {
						n = 1;
					}
					target = offset + dim * n;
					if (offset !== target) {
						amplitude = target - offset;
						timestamp = Date.now();
						requestAnimationFrame(autoScroll);
					}
				});

				$(this).on('carouselPrev', function (e, n) {
					if (n === undefined) {
						n = 1;
					}
					target = offset - dim * n;
					if (offset !== target) {
						amplitude = target - offset;
						timestamp = Date.now();
						requestAnimationFrame(autoScroll);
					}
				});

				$(this).on('carouselSet', function (e, n) {
					if (n === undefined) {
						n = 0;
					}
					cycleTo(n);
				});

				// autoSlide
				if (options.autoSlide) {

					var me = this;

					var auto = setInterval(function () {
						$(me).trigger('carouselNext');
					}, options.autoSlideTime);

					view.hover(function () {
						clearInterval(auto);
					}, function () {
						auto = setInterval(function () {
							$(me).trigger('carouselNext');
						}, options.autoSlideTime);
					});
				}

			});
		},
		next: function (n) {
			$(this).trigger('carouselNext',n);
		},
		prev: function (n) {
			$(this).trigger('carouselPrev',n);
		},
		set: function (n) {
			$(this).trigger('carouselSet',n);
		}
	};
	$.fn.carousel = function (CarouselOptions) {
		// 通用写法
		if (carousel[CarouselOptions]) {
			return carousel[CarouselOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof CarouselOptions === 'object' || !CarouselOptions) {
			return carousel.init.apply(this, arguments);
		} else {
			$.error('Method ' + CarouselOptions + ' does not exist on jQuery.carousel');
		}
	};
}(jQuery, window));