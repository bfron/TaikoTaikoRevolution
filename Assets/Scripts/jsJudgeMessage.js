#pragma strict

var closeTimer = 0;
var open : boolean = false;

var wadaDong : Transform;

function Start () {

}

function Update () {

	if(closeTimer > 100 && open == true) {
		JudClose();
		open = false;
		closeTimer = 0;
	}
		
	closeTimer++;

}

function JudCool() {
	wadaDong.SendMessage("MissFalse", SendMessageOptions.DontRequireReceiver); // MISS 판정 표시
	closeTimer = 0;
	transform.renderer.material = Resources.Load("Judgement/materials/COOL");
	animation.Stop();
	animation.Play("judOpen");
	open = true;
	
}
function JudGreat() {
	wadaDong.SendMessage("MissFalse", SendMessageOptions.DontRequireReceiver); // MISS 판정 표시
	closeTimer = 0;
	transform.renderer.material = Resources.Load("Judgement/materials/GREAT");
	animation.Stop();
	animation.Play("judOpen");
	open = true;
}
function JudGood() {
	wadaDong.SendMessage("MissFalse", SendMessageOptions.DontRequireReceiver); // MISS 판정 표시	
	closeTimer = 0;
	transform.renderer.material = Resources.Load("Judgement/materials/GOOD");
	animation.Stop();
	animation.Play("judOpen");
	open = true;
}
function JudBad() {
	wadaDong.SendMessage("MissTrue", SendMessageOptions.DontRequireReceiver); // MISS 판정 표시
	closeTimer = 0;
	transform.renderer.material = Resources.Load("Judgement/materials/BAD");
	animation.Stop();
	animation.Play("judOpen");
	open = true;
}
function JudMiss() {
	wadaDong.SendMessage("MissTrue", SendMessageOptions.DontRequireReceiver); // MISS 판정 표시
	closeTimer = 0;
	transform.renderer.material = Resources.Load("Judgement/materials/MISS");
	animation.Stop();
	animation.Play("judOpen");
	open = true;
}
function JudClose() {
	animation.Play("judClose");
}