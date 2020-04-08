/*
 * jQuery liMarquee v 4.6
 *
 * Copyright 2013, Linnik Yura | LI MASS CODE | http://masscode.ru
 * http://masscode.ru/index.php/k2/item/44-limarquee
 * Free to use
 *
 * Last Update 20.11.2014
 * 20170708 slj add 事件保留
 */
(function ($) {
	var methods = {
		init: function (options) {
			var p = {
				direction : 'left',// 滚动方向，可选 left / right / up / down
				loop : -1,// 循环次数，-1 为无限循环
				scrolldelay : 0,// 每次重复之前的延迟
				scrollamount : 50,// 滚动速度，越大越快
				circular : true,// 无缝滚动，如果为 false，则和 marquee 效果一样
				drag : true,// 鼠标可拖动
				runshort : true,// 内容不足是否滚动
				hoverstop : true,// 鼠标悬停暂停
				inverthover : false,// 反向，即默认不滚动，鼠标悬停滚动
				xml : false, // 加载 xml 文件
				keepEvent: true //20170708 slj add是否保留事件,例如:滚动内容的点击事件,鼠标移动上去的tooltips,为false则滚动一次后事件失效
			};
			if (options) {
				$.extend(p, options);
			}

			return this.each(function () {
				var enterEvent = 'mouseenter';
				var leaveEvent = 'mouseleave';
				if(p.inverthover){
					enterEvent = 'mouseleave';
					leaveEvent = 'mouseenter';	
				}
								
				var loop = p.loop,
					strWrap = $(this).addClass('str_wrap').data({scrollamount:p.scrollamount}),
					fMove = false;
				
				var strWrapStyle = strWrap.attr('style'); 
				if(strWrapStyle){
					var wrapStyleArr = strWrapStyle.split(';');
					var startHeight = false;
					for(var i=0; i < wrapStyleArr.length; i++){
						var str = $.trim(wrapStyleArr[i]);					
						var tested =  str.search(/^height/g);
						if(tested != -1){
							startHeight = parseFloat(strWrap.css('height'));
						}
					}
				}

				var code = function () {
					strWrap.off('mouseleave');
					strWrap.off('mouseenter');
					strWrap.off('mousemove');
					strWrap.off('mousedown');
					strWrap.off('mouseup');
					
					if(!$('.str_move',strWrap).length){
						strWrap.wrapInner($('<div>').addClass('str_move'));
					}
					
					var
					strMove = $('.str_move', strWrap).addClass('str_origin'),
					strMoveClone = strMove.clone(p.keepEvent).removeClass('str_origin').addClass('str_move_clone'),
					time = 0;

					if (!p.hoverstop) {
						strWrap.addClass('noStop');
					}

					var circCloneHor = function(){
						strMoveClone.clone(p.keepEvent).css({
							left:'100%',
							right:'auto',							
							width: strMove.width()
						}).appendTo(strMove);
						strMoveClone.css({
							right: '100%',
							left:'auto',
							width: strMove.width()
						}).appendTo(strMove);
					}
					
					var circCloneVert = function(){
						strMoveClone.clone(p.keepEvent).css({
							top: '100%',
							bottom:'auto',
							height: strMove.height()
						}).appendTo(strMove);
						strMoveClone.css({
							bottom: '100%',
							top:'auto',
							height:strMove.height()
						}).appendTo(strMove);
					}
					
					if (p.direction == 'left') {
						strWrap.height(strMove.outerHeight())
						if (strMove.width() > strWrap.width()) {
							var leftPos = -strMove.width();
							
							if (p.circular) {
								if (!p.xml) {
									circCloneHor()
									leftPos = -(strMove.width() + (strMove.width() - strWrap.width()));
								}
							}
							if (p.xml) {
								strMove.css({
									left:strWrap.width()	
								});
							}
							var strMoveLeft = strWrap.width(),
								k1 = 0,
								timeFunc1 = function () {
									var fullS = Math.abs(leftPos),
										time = (fullS / strWrap.data('scrollamount')) * 1000;
									if (parseFloat(strMove.css('left')) != 0) {
										fullS = (fullS + strWrap.width());
										time = (fullS - (strWrap.width() - parseFloat(strMove.css('left')))) / strWrap.data('scrollamount') * 1000;
									}
									return time;
								},
								moveFuncId1 = false,
								moveFunc1 = function () {
									if (loop != 0) {
										strMove.stop(true).animate({
											left: leftPos
										}, timeFunc1(), 'linear', function () {
											$(this).css({
												left: strWrap.width()
											});
											if (loop == -1) {
												moveFuncId1 = setTimeout(moveFunc1, p.scrolldelay);
											} else {
												loop--;
												moveFuncId1 = setTimeout(moveFunc1, p.scrolldelay);
											}
										});
									}
								};
								strWrap.data({
									moveId: moveFuncId1,
									moveF : moveFunc1
								})
								if(!p.inverthover){
									moveFunc1();
								}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									clearTimeout(moveFuncId1);
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc1();
								});

								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if(p.inverthover){
											strMove.stop(true);
										}
										//drag
										var dragLeft;
										var dir = 1;
										var newX;
										var oldX = e.clientX;
										//drag
										strMoveLeft = strMove.position().left;
										k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
										
										$(this).on('mousemove', function (e) {
											fMove = true;
											//drag
											newX = e.clientX;
											if(newX > oldX){
												dir = 1;
											}else{
												dir = -1;
											}
											oldX = newX;
											dragLeft = k1 + (e.clientX - strWrap.offset().left);
											
											if (!p.circular) {
												if(dragLeft < -strMove.width() && dir < 0){
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if(dragLeft > strWrap.width() && dir > 0){
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											}else{
												if(dragLeft < -strMove.width() && dir < 0){
													dragLeft = 0;
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if(dragLeft > 0 && dir > 0){
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											}
											
											strMove.stop(true).css({
												left: dragLeft
											});
											//drag
										}).on('mouseup', function () {
											$(this).off('mousemove');
											if(p.inverthover){
												strMove.trigger('mouseenter');
											}
											setTimeout(function () {                             
												fMove = false;
											}, 50);
										});
										return false;
									})
									.on('click', function () {
										if (fMove) {
											return false;
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								strMove.css({
									left: strWrap.width()
								});
								var strMoveLeft = strWrap.width(),
									k1 = 0,
									timeFunc = function () {
										time = (strMove.width() + strMove.position().left) / strWrap.data('scrollamount') * 1000;
										return time;
									};
								var moveFunc = function () {
									var leftPos = -strMove.width();
									strMove.animate({
										left: leftPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											left: strWrap.width()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										}
									});
								};
								strWrap.data({
									moveF : moveFunc
								})
								if(!p.inverthover){
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});

									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if(p.inverthover){
												strMove.stop(true);
											}
											//drag
											var dragLeft;
											var dir = 1;
											var newX;
											var oldX = e.clientX;
											//drag
											strMoveLeft = strMove.position().left;
											k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
											$(this).on('mousemove', function (e) {
												fMove = true;
												//drag
												newX = e.clientX;
												if(newX > oldX){
													dir = 1;
												}else{
													dir = -1;
												}
												oldX = newX;
												dragLeft = k1 + (e.clientX - strWrap.offset().left);
												
												if(dragLeft < -strMove.width() && dir < 0){
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if(dragLeft > strWrap.width() && dir > 0){
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k1 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												
												strMove.stop(true).css({
													left: dragLeft
												});
											}).on('mouseup', function () {
												if(p.inverthover){
													strMove.trigger('mouseenter');
												}
												$(this).off('mousemove');
												setTimeout(function () {                             
													fMove = false;
												}, 50);
											});
											return false;
										})
										.on('click', function () {
											if (fMove) {
												return false;
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
					if (p.direction == 'right') {
						strWrap.height(strMove.outerHeight());
						strWrap.addClass('str_right');
						strMove.css({
							left: -strMove.width(),
							right: 'auto'
						})
						
						if (strMove.width() > strWrap.width()) {
							var leftPos = strWrap.width();
							strMove.css({
								left: 0
							})
							if (p.circular) {
								if (!p.xml) {
									circCloneHor();
									leftPos = strMove.width();
								}
							}
							
							var k2 = 0;
							timeFunc = function () {
								var fullS = strWrap.width(),
									time = (fullS / strWrap.data('scrollamount')) * 1000;
								if (parseFloat(strMove.css('left')) != 0) {
									fullS = (strMove.width() + strWrap.width());
									time = (fullS - (strMove.width() + parseFloat(strMove.css('left')))) / strWrap.data('scrollamount') * 1000;
								}
								return time;
							};
							var moveFunc = function () {
								if (loop != 0) {
									strMove.animate({
										left: leftPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											left: -strMove.width()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
							};
							strWrap.data({
								moveF : moveFunc
							})
					
							if(!p.inverthover){
								moveFunc();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc();
								});

								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if(p.inverthover){
											strMove.stop(true);
										}
										//drag
										var dragLeft;
										var dir = 1;
										var newX;
										var oldX = e.clientX;
										//drag
										strMoveLeft = strMove.position().left;
										k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
										$(this).on('mousemove', function (e) {
											fMove = true;
											//drag
											newX = e.clientX;
											if(newX > oldX){
												dir = 1;
											}else{
												dir = -1;
											}
											oldX = newX;
											dragLeft = k2 + (e.clientX - strWrap.offset().left);

											if (!p.circular) {
												if(dragLeft < -strMove.width() && dir < 0){
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if(dragLeft > strWrap.width() && dir > 0){
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											}else{
												if(dragLeft < -strMove.width() && dir < 0){
													dragLeft = 0;
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if(dragLeft > 0 && dir > 0){
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
											}
											
											strMove.stop(true).css({
												left: dragLeft
											});
										}).on('mouseup', function () {
											if(p.inverthover){
												strMove.trigger('mouseenter');
											}
											$(this).off('mousemove');
											setTimeout(function () {                             
												fMove = false;
											}, 50);
										});
										return false;
									})
									.on('click', function () {
										if (fMove) {
											return false;
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								var k2 = 0;
								var timeFunc = function () {
									time = (strWrap.width() - strMove.position().left) / strWrap.data('scrollamount') * 1000;
									return time;
								};
								var moveFunc = function () {
									var leftPos = strWrap.width();
									strMove.animate({
										left: leftPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											left: -strMove.width()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};

								strWrap.data({
									moveF : moveFunc
								})

								if(!p.inverthover){
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});

									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if(p.inverthover){
												strMove.stop(true);
											}
											//drag
											var dragLeft;
											var dir = 1;
											var newX;
											var oldX = e.clientX;
											//drag
											strMoveLeft = strMove.position().left;
											k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
											$(this).on('mousemove', function (e) {
												fMove = true;
												//drag
												newX = e.clientX;
												if(newX > oldX){
													dir = 1;
												}else{
													dir = -1;
												}
												oldX = newX;
												dragLeft = k2 + (e.clientX - strWrap.offset().left);
												
												if(dragLeft < -strMove.width() && dir < 0){
													dragLeft = strWrap.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}
												if(dragLeft > strWrap.width() && dir > 0){
													dragLeft = -strMove.width();
													strMoveLeft = strMove.position().left;
													k2 = strMoveLeft - (e.clientX - strWrap.offset().left);
												}

												strMove.stop(true).css({
													left:dragLeft
												});
												
											}).on('mouseup', function () {
												if(p.inverthover){
													strMove.trigger('mouseenter');
												}
												$(this).off('mousemove');
												setTimeout(function () {                             
													fMove = false;
												}, 50);
											});
											return false;
										})
										.on('click', function () {
											if (fMove) {
												return false;
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
					if (p.direction == 'up') {
						strWrap.addClass('str_vertical');
						
						if (strMove.height() > strWrap.height()) {
							var topPos = -strMove.height();
							if (p.circular) {
								if (!p.xml) {
									circCloneVert();									
									topPos = -(strMove.height() + (strMove.height() - strWrap.height()));
								}
							}
							if (p.xml) {
								strMove.css({
									top:strWrap.height()	
								})
							}
							var k2 = 0;
							timeFunc = function () {
								var fullS = Math.abs(topPos),
									time = (fullS / strWrap.data('scrollamount')) * 1000;
								if (parseFloat(strMove.css('top')) != 0) {
									fullS = (fullS + strWrap.height());
									time = (fullS - (strWrap.height() - parseFloat(strMove.css('top')))) / strWrap.data('scrollamount') * 1000;
								}
								return time;
							};
							var moveFunc = function () {
								if (loop != 0) {
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: strWrap.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
							};
							
							strWrap.data({
								moveF : moveFunc
							})
							
							if(!p.inverthover){
								moveFunc();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc();
								});

								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if(p.inverthover){
											strMove.stop(true);
										}
										//drag
										var dragTop;
										var dir = 1;
										var newY;
										var oldY = e.clientY;
										//drag
										strMoveTop = strMove.position().top;
										k2 = strMoveTop - (e.clientY - strWrap.offset().top);
										$(this).on('mousemove', function (e) {
											fMove = true;
											//drag
											newY = e.clientY;
											if(newY > oldY){
												dir = 1;
											}else{
												if(newY < oldY){
													dir = -1;
												}
											}
											oldY = newY;
											dragTop = k2 + e.clientY - strWrap.offset().top;
											if (!p.circular){
												if(dragTop < -strMove.height() && dir < 0){
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if(dragTop > strWrap.height() && dir > 0){
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}	
											}else{
												if(dragTop < -strMove.height() && dir < 0){
													dragTop = 0;
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if(dragTop > 0 && dir > 0){
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
											}

											strMove.stop(true).css({
												top: dragTop
											});
										}).on('mouseup', function () {
											if(p.inverthover){
												strMove.trigger('mouseenter');
											}
											$(this).off('mousemove');
											setTimeout(function () {                             
												fMove = false;
											}, 50);
										});
										return false;
									})
									.on('click', function () {
										if (fMove) {
											return false;
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								strMove.css({
									top: strWrap.height()
								});
								var k2 = 0;
								var timeFunc = function () {
									time = (strMove.height() + strMove.position().top) / strWrap.data('scrollamount') * 1000;
									return time;
								};
								var moveFunc = function () {
									var topPos = -strMove.height();
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: strWrap.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
								strWrap.data({
									moveF : moveFunc
								})
								if(!p.inverthover){
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});

									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if(p.inverthover){
												strMove.stop(true);
											}
											//drag
											var dragTop;
											var dir = 1;
											var newY;
											var oldY = e.clientY;
											//drag
											strMoveTop = strMove.position().top;
											k2 = strMoveTop - (e.clientY - strWrap.offset().top);
											$(this).on('mousemove', function (e) {
												fMove = true;
												//drag
												newY = e.clientY;
												if(newY > oldY){
													dir = 1;
												}else{
													if(newY < oldY){
														dir = -1;
													}
												}
												oldY = newY;
												dragTop = k2 + e.clientY - strWrap.offset().top;
												
												if(dragTop < -strMove.height() && dir < 0){
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if(dragTop > strWrap.height() && dir > 0){
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}	
												//*drag
												strMove.stop(true).css({
													top: dragTop
												});
											}).on('mouseup', function () {
												if(p.inverthover){
													strMove.trigger('mouseenter');
												}
												$(this).off('mousemove');
												setTimeout(function () {                             
													fMove = false;
												}, 50);
											});
											return false;
										})
										.on('click', function () {
											if (fMove) {
												return false;
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
					if (p.direction == 'down') {
						strWrap.addClass('str_vertical').addClass('str_down');
						strMove.css({
							top: -strMove.height(),
							bottom: 'auto'
						})
						if (strMove.height() > strWrap.height()) {
							var topPos = strWrap.height();
							if (p.circular) {
								if (!p.xml) {
									circCloneVert();									
									topPos = strMove.height();
								}
							}
							if (p.xml) {
								strMove.css({
									top:-strMove.height()
								})
							}
							var k2 = 0;
							timeFunc = function () {
								var fullS = strWrap.height(),
									time = (fullS / strWrap.data('scrollamount')) * 1000;
								if (parseFloat(strMove.css('top')) != 0) {
									fullS = (strMove.height() + strWrap.height());
									time = (fullS - (strMove.height() + parseFloat(strMove.css('top')))) / strWrap.data('scrollamount') * 1000;
								}
								return time;
							};
							var moveFunc = function () {
								if (loop != 0) {
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: -strMove.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
							};
							strWrap.data({
								moveF : moveFunc
							})
							if(!p.inverthover){
								moveFunc();
							}
							if (p.hoverstop) {
								strWrap.on(enterEvent, function () {
									$(this).addClass('str_active');
									strMove.stop(true);
								}).on(leaveEvent, function () {
									$(this).removeClass('str_active');
									$(this).off('mousemove');
									moveFunc();
								});

								if (p.drag) {
									strWrap.on('mousedown', function (e) {
										if(p.inverthover){
											strMove.stop(true);
										}
										//drag
										var dragTop;
										var dir = 1;
										var newY;
										var oldY = e.clientY;
										//drag
										strMoveTop = strMove.position().top;
										k2 = strMoveTop - (e.clientY - strWrap.offset().top);
										$(this).on('mousemove', function (e) {
											fMove = true;
											//drag
											newY = e.clientY;
											if(newY > oldY){
												dir = 1;
											}else{
												if(newY < oldY){
													dir = -1;
												}
											}
											oldY = newY;
											dragTop = k2 + e.clientY - strWrap.offset().top;
											if (!p.circular){
												if(dragTop < -strMove.height() && dir < 0){
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if(dragTop > strWrap.height() && dir > 0){
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}	
											}else{
												if(dragTop < -strMove.height() && dir < 0){
													dragTop = 0;
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if(dragTop > 0 && dir > 0){
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
											}
											
											strMove.stop(true).css({
												top: dragTop
											});

										}).on('mouseup', function () {
											if(p.inverthover){
												strMove.trigger('mouseenter');
											}
											$(this).off('mousemove');
											setTimeout(function () {                             
												fMove = false;
											}, 50);
										});
										return false;
									})
									.on('click', function () {
										if (fMove) {
											return false;
										}
									});
								} else {
									strWrap.addClass('no_drag');
								};
							}
						} else {
							if (p.runshort) {
								var k2 = 0;
								var timeFunc = function () {
									time = (strWrap.height() - strMove.position().top) / strWrap.data('scrollamount') * 1000;
									return time;
								};
								var moveFunc = function () {
									var topPos = strWrap.height();
									strMove.animate({
										top: topPos
									}, timeFunc(), 'linear', function () {
										$(this).css({
											top: -strMove.height()
										});
										if (loop == -1) {
											setTimeout(moveFunc, p.scrolldelay);
										} else {
											loop--;
											setTimeout(moveFunc, p.scrolldelay);
										};
									});
								};
								strWrap.data({
									moveF : moveFunc
								})
								if(!p.inverthover){
									moveFunc();
								}
								if (p.hoverstop) {
									strWrap.on(enterEvent, function () {
										$(this).addClass('str_active');
										strMove.stop(true);
									}).on(leaveEvent, function () {
										$(this).removeClass('str_active');
										$(this).off('mousemove');
										moveFunc();
									});

									if (p.drag) {
										strWrap.on('mousedown', function (e) {
											if(p.inverthover){
												strMove.stop(true);
											}
											//drag
											var dragTop;
											var dir = 1;
											var newY;
											var oldY = e.clientY;
											//drag
											strMoveTop = strMove.position().top;
											k2 = strMoveTop - (e.clientY - strWrap.offset().top);
											$(this).on('mousemove', function (e) {
												fMove = true;
												//drag
												newY = e.clientY;
												if(newY > oldY){
													dir = 1;
												}else{
													if(newY < oldY){
														dir = -1;
													}
												}
												oldY = newY;
												dragTop = k2 + e.clientY - strWrap.offset().top;
												if(dragTop < -strMove.height() && dir < 0){
													dragTop = strWrap.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}
												if(dragTop > strWrap.height() && dir > 0){
													dragTop = -strMove.height();
													strMoveTop = strMove.position().top;
													k2 = strMoveTop - (e.clientY - strWrap.offset().top);
												}	
												
												strMove.stop(true).css({
													top: dragTop
												});
												
											}).on('mouseup', function () {
												if(p.inverthover){
													strMove.trigger('mouseenter');
												}
												$(this).off('mousemove');
												setTimeout(function () {                             
													fMove = false;
												}, 50);
											})
											return false;
										})
										.on('click', function () {
											if (fMove) {
												return false;
											}
										});
									} else {
										strWrap.addClass('no_drag');
									};
								}
							} else {
								strWrap.addClass('str_static');
							}
						};
					};
				}
				if (p.xml) {
					$.ajax({
						url: p.xml,
						dataType: "xml",
						success: function (xml) {
							var xmlTextEl = $(xml).find('text');
							var xmlTextLength = xmlTextEl.length;
							for(var i = 0; i < xmlTextLength; i++){
								var xmlElActive = xmlTextEl.eq(i);
								var xmlElContent = xmlElActive.text();
								var xmlItemEl = $('<span>').text(xmlElContent).appendTo(strWrap);
								
								if(p.direction == 'left' || p.direction == 'right'){
									xmlItemEl.css({display:'inline-block',textAlign:'right'});	
									if(i > 0){
										xmlItemEl.css({width:strWrap.width()+xmlItemEl.width()});	
									}
								}
								if(p.direction == 'down' || p.direction == 'up'){
									xmlItemEl.css({display:'block',textAlign:'left'});	
										if(i > 0){
											xmlItemEl.css({paddingTop:strWrap.height()});
										}
								}
							}
							code();
						}
					});
				} else {
					code();
				}
				strWrap.data({
					ini:code,
					startheight: startHeight	
				});
			});
		},
		update: function () {
			var el = $(this);
			var str_origin = $('.str_origin',el);
			var str_move_clone = $('.str_move_clone',el);
			str_origin.stop(true);
			str_move_clone.remove();
			el.data('ini')();
		},
		destroy: function () {
			var el = $(this);
			var elMove = $('.str_move',el);
			var startHeight = el.data('startheight');
			
			$('.str_move_clone',el).remove();
			el.off('mouseenter');
			el.off('mousedown');
			el.off('mouseup');
			el.off('mouseleave');
			el.off('mousemove');
			el.removeClass('noStop').removeClass('str_vertical').removeClass('str_active').removeClass('no_drag').removeClass('str_static').removeClass('str_right').removeClass('str_down');
			
			var elStyle = el.attr('style'); 
			if(elStyle){
				var styleArr = elStyle.split(';');
				for(var i=0; i < styleArr.length; i++){
					var str = $.trim(styleArr[i]);
					var tested =  str.search(/^height/g);
					if(tested != -1){
						styleArr[i] = '';	
					}
				}
				var newArr = styleArr.join(';');
				var newStyle =  newArr.replace(/;+/g,';')
			
				if(newStyle == ';'){
					el.removeAttr('style');	
				}else{
					el.attr('style',newStyle);	
				}
				
				if(startHeight){
					el.css({height:startHeight})	
				}
			}
			elMove.stop(true);

			if(elMove.length){
				var context = elMove.html();
				elMove.remove();
				el.html(context);
			}
	
		},
		pause: function(){	
			var el = $(this);
			var elMove = $('.str_move',el);
			elMove.stop(true);
		}, 
		play: function(){
			var el = $(this);
			$(this).off('mousemove');
			el.data('moveF')();	
		}
	};
	$.fn.liMarquee = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('方法' + method + '未被jQuery.liMarquee支持.');
		}
	};
})(jQuery);