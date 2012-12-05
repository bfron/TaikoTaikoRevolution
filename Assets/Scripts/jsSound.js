#pragma strict

var audioDong : AudioClip;
var audioKat : AudioClip;

function Start () {

}

function Update () {

	if(Input.GetButtonDown("Dong1") || Input.GetButtonDown("Dong2")) {
		//audio.PlayOneShot(audioDong);
		AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	}
	else if(Input.GetButtonDown("Kat1") || Input.GetButtonDown("Kat2")) {
		AudioSource.PlayClipAtPoint(audioKat, Vector3.zero);
	}

}