;(function($){
	/*  把 data 属性上的 参数变成对象  */
	var markObj = function(data,obj){
		obj = (typeof obj == 'object') ? obj : {};
		var oData = data.split('&');
		for(var i=0,j=oData.length;i<j;i++){
			var oDataTwo = oData[i].split('=');
			obj[oDataTwo[0]] = oDataTwo[1];
		};
		return obj;
	}
	var formatFormData = function(dom, obj){
		var data = obj && typeof obj == 'object' ? obj : {},
			dom = dom || $(document),
			dText = $('input[type=text]', dom),
			dHidden = $('input[type=hidden]', dom),
			dCheckBox = $('input[type=checkbox]', dom),
			dTextarea = $('textarea', dom),
			dRadio = $('input[type=radio]', dom),
			dPwd = $('input[type=password]', dom),
			dSelect = $('select', dom);
		for(var i=0,j=dCheckBox.length;i<j;i++){
			var dCheckBoxName = dCheckBox.eq(i).attr('name'),
				dCheckBoxValue = dCheckBox.eq(i).val();
			if(dCheckBox[i].checked){
				// make the checkbox collections to array
				if(/\[\]$/.test(dCheckBoxName)){
					dCheckBoxName = dCheckBoxName.replace('[]','');
					if($.isArray(data[dCheckBoxName])){
						data[dCheckBoxName].push(dCheckBoxValue);
					}else{
						data[dCheckBoxName] = [];
						data[dCheckBoxName].push(dCheckBoxValue);
					}
				}else{
					data[dCheckBoxName] = dCheckBox.eq(i).val();
				}
			}
		}
		for(var i=0,j=dHidden.length;i<j;i++){
			var dHiddenName = dHidden.eq(i).attr('name'),
				dHiddenValue = dHidden.eq(i).val();
			// make the checkbox collections to array
			if(/\[\]$/.test(dHiddenName)){
				dHiddenName = dHiddenName.replace('[]','');
				if($.isArray(data[dHiddenName])){
					data[dHiddenName].push(dHiddenValue);
				}else{
					data[dHiddenName] = [];
					data[dHiddenName].push(dHiddenValue);
				}
			}else{
				data[dHiddenName] = dHidden.eq(i).val();
			}
			//data[dHidden.eq(i).attr('name')] = dHidden.eq(i).val();
		}
		// make the array to string as array
		for(var i in data){
			if($.isArray(data[i])){
				data[i] = '["' + data[i].join('","') + '"]';
			}
			if(data[i]) data[i] = data[i].replace(/"\{/ig, '{').replace(/\}"/ig, '}')
		}
		//loop:
		var tmp = '';
		for(var i=0,j=dRadio.length;i<j;i++){
			var radioName = dRadio.eq(i).attr('name');
			if(tmp.indexOf('*' + radioName + '*') < 0){
				tmp += '*' + radioName + '*';
			}
			var oRadio = $('input[name=' + radioName + ']');
			for(var n=0,m=oRadio.length;n<m;n++){
				if(oRadio[n].checked){
					data[radioName] = oRadio.eq(n).val();
					break;
					//continue loop;
				};
			}
		}
		for(var i=0,j=dSelect.length;i<j;i++){
			var dSelectVal = dSelect.eq(i).val();
			if($.isArray(dSelectVal)){
				data[dSelect.eq(i).attr('name')] = '["' + dSelectVal.join('","') + '"]';
			} else {
				data[dSelect.eq(i).attr('name')] = dSelectVal;
			}
		}
		for(var i=0,j=dText.length;i<j;i++){
			data[dText.eq(i).attr('name')] = dText.eq(i).val();
		}
		for(var i=0,j=dPwd.length;i<j;i++){
			data[dPwd.eq(i).attr('name')] = dPwd.eq(i).val();
		}
		for(var i=0,j=dTextarea.length;i<j;i++){
			data[dTextarea.eq(i).attr('name')] = dTextarea.eq(i).val();
		}
		return data;
	};
	$(function(){
		var iSubmit = false;
		$(document).delegate('.eCommentTextArea', 'touchstart', function(){
			var oThis = $(this);
			oThis.addClass('focus');
			$('.comment .btn').css({'display':'inline-block'});
		});

		$(document).delegate('.eCommentTextArea', 'blur', function(){
			var oThis = $(this);
			setTimeout(function(){
				if($.trim(oThis.val()) == '' && !iSubmit) return;
				if($.trim(oThis.val()) != '') return;
				$('.comment .btn').hide();
				oThis.val('').removeClass('focus').prev().show();
			}, 500);
		});

		$(document).delegate('.eCommentTextArea', 'touchend', function(){
			var oThis = $(this);
			oThis.removeClass('ui-focus').prev().hide();
		});

		$(document).delegate('.eCancelBtn', 'click', function(){
			var oThis = $(this);
			$('.eCommentTextArea').val('').removeClass('focus').prev().show();
			$('.comment .btn').hide();
		});

		$(document).delegate('.getMore', 'click', function(){
			var oData = {}, oThis = $(this),
				temData = oThis.attr('data');
			if(temData){
				oData = markObj(temData, oData);
			}
			var dLastId = $('#commentLists dl:last').attr('id');
			if(oData.lastId != dLastId){
				oData.lastId = dLastId;
			}
			console.log(oData);
			$.ajax({
				type: 'GET',
				url: oThis.attr('data-url'),
				data: oData,
				success: function(response){
					try{
						json = typeof response == 'string' ? $.parseJSON(response) : response;
					} catch (err){
						alert('data error');
						return;
					}
					if(json.msg){
						alert(json.msg);
					}
					if(json.data){
						$('#commentLists').append(json.data);
					}
				}
			})
		});


		$(document).delegate('.eCommentBtn', 'click', function(){
			var oData = {}, oThis = $(this),
				dComment = $.trim($('.eCommentTextArea').val());
			if(dComment == '') {
				iSubmit = false;
				alert('评论内容不能为空')
			} else {
				var temData = oThis.attr('data');
				if(temData){
					oData = markObj(temData, oData);
				}
				oData = formatFormData($(oThis.attr('data-form')), oData);
				$.ajax({
					type: 'POST',
					url: oThis.attr('data-url'),
					data: oData,
					success: function(response){
						try{
							json = typeof response == 'string' ? $.parseJSON(response) : response;
						} catch (err){
							alert('data error');
							return;
						}
						if(json.msg){
							alert(json.msg);
						}
						if(json.data){
							var dHtml = '<dl id="'+ json.data.id +'" class="clearfix"><dt><img src="'+ json.data.avatar +'" title="'+ json.data.userName +'" /></dt><dd><span>'+ json.data.date +'</span><p>'+ json.data.comment +'</p></dd></dl>';
							$('#commentLists').append(dHtml);
						}
					}
				})
			}
		});
		var oListData = {},
			dGetCommentList = $('.eGetCommentList'),
			dListData = dGetCommentList.attr('data'),
			dListUrl = dGetCommentList.attr('data-url');
		if(dListData){
			oListData = markObj(dListData, oListData);
		}
		$.ajax({
			type: 'GET',
			url: dListUrl,
			data: oListData,
			success: function(response){
				try{
					json = typeof response == 'string' ? $.parseJSON(response) : response;
				} catch (err){
					alert('data error');
					return;
				}
				if(json.msg){
					alert(json.msg);
				}
				if(json.data){
					$(dGetCommentList.attr('data-target')).append(json.data);
				}
			}
		})
	})
})(jQuery);
