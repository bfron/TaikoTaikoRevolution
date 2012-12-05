#pragma strict

var miss = false;
var normalAni = false;
var missAni = false;

function Start () {
		
}

function Update () {

	if(normalAni == false && miss == false)
		Normal();
	else if(missAni == false && miss == true)
		Miss();
	
}
function Normal() {
	normalAni = true;
	
	transform.renderer.material.mainTexture = Resources.Load("WadaDong/Normal1");
	yield WaitForSeconds(jsMakeNote.maketime / 4);
	if(missAni == true) { // miss 애니메이션이 발동되면 작동을 멈추게 한다.
		normalAni = false;
		return;
	}
	transform.renderer.material.mainTexture = Resources.Load("WadaDong/Normal2");
	yield WaitForSeconds(jsMakeNote.maketime / 4);
	
	normalAni = false;
}
function Miss() {
	missAni = true;
		
	transform.renderer.material.mainTexture = Resources.Load("WadaDong/Miss1");
	yield WaitForSeconds(jsMakeNote.maketime / 4);
	if(normalAni == true) { // normal 애니메이션이 발동되면 작동을 멈추게 한다.
		missAni = false;
		return;
	}
	transform.renderer.material.mainTexture = Resources.Load("WadaDong/Miss2");
	yield WaitForSeconds(jsMakeNote.maketime / 4);
	missAni = false;
}
function MissTrue() {
	miss = true;
}
function MissFalse() {
	miss = false;
}