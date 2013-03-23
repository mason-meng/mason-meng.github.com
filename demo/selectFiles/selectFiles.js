/* Desc  : like window select the files and folders function
 * Author: Mason Meng
 * Email : mason.meng@yahoo.com
 * Date  : 2012-08-16
 * Blog  : http://f2ecoder.com
 * web   : http://artf2e.com
 */
(function($){
	var oThis = {}, oVar = {}, isCount = true;
		oVar.isSelect = false;
		oVar.isInBox = false;
		oVar.iBoxW = 0;
		oVar.iBoxH = 0;
		mark = document.createElement('div'),
		isIE=!!window.ActiveXObject,
		isIE6=isIE&&!window.XMLHttpRequest,
		isIE8=isIE&&!!document.documentMode,
		isIE7=isIE&&!isIE6&&!isIE8;
	$.fn.extend({
		selectBox: function(options){
			var op = $.extend({
					listBox:'#dataListContainer',
					callBack:{}
				}, options);
			oThis = $(op.listBox);
			var dBindId = op.listBox.replace('#', ''),
				isIEListen = document.getElementById(dBindId)
			oThis.bind('mousedown', function(e){
				var iCount = 1,
					dThisH = oThis.height(),
					dListH = $('ul', oThis).height(),
					hasScroll = dListH > dThisH ? 21 : 3,
					evt = e || window.event,
					eBingDom = window.chrome || $.browser.safari ? $(document) : oThis;
				$('#contextMenu').hide();//alert(45)
				if($(e.target).parents(op.listBox).attr('id') != dBindId){
					$('li', oThis).removeClass('focus').find('input[type="checkbox"]').attr('checked', false);
					$('.selectAll').attr('checked', false);
					//oFun.rightSideInfo();
				}
				
				if(oThis.attr('id') == op.listBox || !$(e.target).parents(op.listBox) || ($('li', oThis).length<1)){
					eBingDom.unbind('mousemove');
					return;
				}
				// the mouse move out of window, the event allway can use
				if (isIEListen.setCapture) {
					isIEListen.setCapture();
				} else if(window.captureEvents){
					window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
				}
				clearEvent(evt);
				oVar.startX = evt.pageX;
				oVar.startY = evt.pageY;
				oVar.iSelect = true;
				oVar.oPosition = oThis.offset();
				oVar.dScrollHeight = oThis.scrollTop();
				oVar.oLists = $('li', oThis);
				oVar.iListNum = oVar.oLists.length;
				oVar.iBoxW = oVar.iListNum > 0 ? parseInt(oVar.oLists[0].offsetWidth) : 0;
				oVar.iBoxH = oVar.iListNum > 0 ? parseInt(oVar.oLists[0].offsetHeight) : 0;
				oVar.dMaskY = oVar.startY - oVar.oPosition.top + oVar.dScrollHeight;
				if((oVar.oPosition.top <= oVar.startY) && ((oThis.width() + oVar.oPosition.left) >= oVar.startX)){
					$(mark).css({'position':'absolute','left':0,'top':0,'border':'1px dashed #09f','background-color':'#c3d5ed','opacity':0.6,'filter':'alpha(opacity:60)','display':'none','z-index':1000});
					oThis.append(mark);
					oVar.timeOut = setInterval(selectTheBoxs, 5);
					/*
if(window.chrome){
						$('#dataListContainer').css({'-webkit-users-select': 'none'});
					}
*/
					eBingDom.bind('mousemove', function(e){
						var evt = e || window.event;
						// insure the start position in the box
						// if in, we can select the box list elements;
						if(oVar.iSelect && oVar.startX > oVar.oPosition.left && (oVar.startX < (oVar.oPosition.left + oThis.width() - hasScroll)) && oVar.startY > oVar.oPosition.top && oVar.startY < oVar.oPosition.top + dThisH){
							oVar.moveX = evt.pageX;
							oVar.moveY = evt.pageY;
							//oVar.dScrollHeight = oThis.scrollTop();
							// Control the select box size;
							oVar.dMaskMovedY = oVar.moveY - oVar.oPosition.top + oVar.dScrollHeight;
							var w = oVar.moveX < oVar.oPosition.left+oThis.width() ? oVar.moveX > oVar.oPosition.left ? Math.abs(oVar.moveX-oVar.startX)  : oVar.startX - oVar.oPosition.left : oVar.oPosition.left+oThis.width() + parseInt(oThis.css('padding-left')) - oVar.startX - hasScroll,
								l = Math.min(oVar.moveX, oVar.startX) > oVar.oPosition.left ? Math.min(oVar.moveX, oVar.startX) : oVar.oPosition.left,
								h = Math.abs(oVar.dMaskY - oVar.dMaskMovedY),
								t = Math.min(oVar.dMaskY, oVar.dMaskMovedY);

							if(isIE6) t =  Math.min(oVar.moveY, oVar.startY) - oThis.offset().top;
							// start scroll select
							if((oVar.dMaskMovedY > oVar.dMaskY) && oVar.moveY > (dThisH + oVar.oPosition.top) && (dThisH + oVar.dScrollHeight) < dListH){ // down
								oVar.dScrollHeight += 10
								oThis.scrollTop(oVar.dScrollHeight);
							} else if(oVar.moveY < oVar.oPosition.top && oVar.dScrollHeight > 0) { //  up
								oVar.dScrollHeight -= 10;
								oThis.scrollTop(oVar.dScrollHeight);
							}
							showSelectTemBox(w,h,l,t);
						}
						clearEvent(evt);
					}).mouseup(function(){
						//-webkit-user-select: policy;
						/*
if(window.chrome){
							//$('#dataListContainer').css({'-webkit-users-select': 'policy'});
						}
*/
						if (isIEListen.releaseCapture) {
							isIEListen.releaseCapture();
						} else if(window.releaseEvents){
							window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
						}
						if(iCount == 1){
							eBingDom.unbind('mousemove');
							// when the mouse up, clear the rubbish
							if(oVar.timeOut) clearInterval(oVar.timeOut);
							oVar.timeOut = null;
							$(mark).css({'position':'absolute','left':0,'top':0,'width':0, 'height':0});
							hideDeleteTemBox();
						}
						iCount++;
						//selectTheBoxs();
					});
				
					oThis.mouseup(function(){
						// when the mouse up, clear the rubbish
						eBingDom.unbind('mousemove');
						$(mark).css({'position':'absolute','left':0,'top':0,'width':0, 'height':0});
						if(oVar.timeOut) clearInterval(oVar.timeOut);
						oVar.timeOut = null;
						hideDeleteTemBox();
					});
				}
			});
		}
	});
	// show the select box function
	function showSelectTemBox(w,h,l,t){
		if(w != 0 || h != 0) $(mark).show().css({'width':w,'height':h,'left':l,'top':t});
	}
	// hide the select box function
	function hideDeleteTemBox(){
		oVar.iSelect = false;
		$(mark).hide();
		//oVar = null;
	}
	// mark the selected boxes function
	function selectTheBoxs(){
		if($(mark).width() == 0 || $(mark).height() == 0) return;
		for(var i=0,j=oVar.iListNum;i<j;i++){
			var oThisList = oVar.oLists.eq(i),
				iListL = oThisList.offset().left,
				iListT = oThisList.offset().top,
				iListR = iListL + oVar.iBoxW,
				iListB = iListT + oVar.iBoxH,
				selBoxL = $(mark).offset().left,
				selBoxT = $(mark).offset().top,
				selBoxR = $(mark).width() + selBoxL,
				selBoxB = $(mark).height() + selBoxT;
			if(selBoxL == 0 && selBoxT ==0) return;
			if(iListR > selBoxL && iListB > selBoxT && iListL < selBoxR && iListT < selBoxB){
				if(!oThisList.hasClass('broken') && $('.desc', oThisList).attr('category') != 'system'){
					oThisList.addClass('focus');
					$('input[type="checkbox"]', oThisList).attr('checked',true);
				}else{
					$('input[type="checkbox"]', oThisList).hide();
				}
			}else{
				oThisList.removeClass('focus');
				$('input[type="checkbox"]', oThisList).attr('checked',false);
			}
		}
	}
	// stop the default event
	function clearEvent(evt){
		if(window.chrome || $.browser.safari) return;
		if (evt.stopPropagation) evt.stopPropagation(); else evt.cancelBubble = true; 
		if (evt.preventDefault) evt.preventDefault(); else evt.returnValue = false; 
	}
})(jQuery);
$(function() {
	$('body').selectBox({listBox:'#dataListContainer'});
});