#pragma strict
/* 북 칠때 나는 소리 + 북 칠때 이미지 변경 담당 */

var katL : Transform;
var katR : Transform;
var dongL : Transform;
var dongR : Transform;

var audioDong : AudioClip;
var audioKat : AudioClip;

function Start () {

}

function Update () {

	if(Input.GetButtonDown("Dong1")) {
		KeyDownDongL();
	}
	if(Input.GetButtonDown("Dong2")) {
		KeyDownDongR();
	} 
	if(Input.GetButtonDown("Kat1")) {
		KeyDownKatL();
	} 
	if(Input.GetButtonDown("Kat2")) {
		KeyDownKatR();
	} 

}

function KeyDownDongL() {
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	dongL.renderer.material.mainTexture = Resources.Load("Vook/Dong-LO");
	yield WaitForSeconds(0.05);
	dongL.renderer.material.mainTexture = Resources.Load("Vook/Dong-LX");
}
function KeyDownDongR() {
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	dongR.renderer.material.mainTexture = Resources.Load("Vook/Dong-RO");
	yield WaitForSeconds(0.05);
	dongR.renderer.material.mainTexture = Resources.Load("Vook/Dong-RX");
}
function KeyDownKatL() {
	AudioSource.PlayClipAtPoint(audioKat, Vector3.zero);
	katL.renderer.material.mainTexture = Resources.Load("Vook/Kat-LO");
	yield WaitForSeconds(0.05);
	katL.renderer.material.mainTexture = Resources.Load("Vook/Kat-LX");
}
function KeyDownKatR() {
	AudioSource.PlayClipAtPoint(audioKat, Vector3.zero);
	katR.renderer.material.mainTexture = Resources.Load("Vook/Kat-RO");
	yield WaitForSeconds(0.05);
	katR.renderer.material.mainTexture = Resources.Load("Vook/Kat-RX");
}