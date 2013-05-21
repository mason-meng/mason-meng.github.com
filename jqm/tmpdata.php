<?php 
$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : null;
//echo $type;exit;
if($type == 'comment'){
	$data = array('stauts' => 200, 'msg' => 'success', 'data' => array('id' => 'sw1we31', 'avatar' => './images/avator.png', 'userName' => 'Mason Meng', 'comment' => 'aaaaa', 'date' => '2012-12-12'));
	echo json_encode($data);
} else if($type == 'more'){
	$module = '
		<dl id="#" class="clearfix">
			<dt><img src="./images/avator.png" title="#" /></dt>
			<dd>
				<span>2013-12-12</span>
				<p>Mason: I don\'t like OT</p>
			</dd>
		</dl>
		<dl id="lastID23232323" class="clearfix">
			<dt><img src="./images/avator.png" title="#" /></dt>
			<dd>
				<span>2013-12-12</span>
				<p>Mason: I don\'t like OT!!!!!!</p>
			</dd>
		</dl>
	';
	$data = array('stauts' => 200, 'msg' => '', 'data' => $module);
	echo json_encode($data);
} else {
	$data = array('stauts' => 200, 'msg' => 'Error', 'data' => '');
	echo json_encode($data);
}
?>