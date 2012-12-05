#pragma strict


function Start () {

}

function Update () {
		
}

function TransformClose() {
	animation.Play("HitCountClose");

}
function TransformOpen() {
	animation.Stop();
	transform.localScale.x = 4;
}