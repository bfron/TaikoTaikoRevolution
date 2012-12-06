#pragma strict
import System.IO;

var text2 : GUIText;

var readOk : boolean;


class NoteInfo {
	var title : String;
	var level : int;
	var bpm : float;
	var starttime : float;
	var totalnote : int;
}
class SongInfo {
	var path : String;
	var normal : NoteInfo;
	var hard : NoteInfo;
	var oni : NoteInfo;
}
static var musiclist : SongInfo[];

function Start () {
	ReadSong();
}
function ReadSong() { // 노래를 읽어들이는 함수
	var folderlist : String[]; // 폴더 리스트가 저장될 변수
	var filelist : String[]; // 폴더 안의 파일 리스트가 저장될 변수
	var tempsongarray = new Array(); // 노래 목록을 저장할 임시 변수

	folderlist = Directory.GetDirectories(Application.dataPath + "/../Song/"); // Song 폴더 밑에 어떤 폴더들이 있는지 찾습니다.
	
	for(var i = 0; i < folderlist.length ; i++)
	{
		text2.text = "";
		var tempsonginfo = new SongInfo(); // 임시로 곡 정보를 저장할 SongInfo형 객체 생성
		var songfile = false; // 노래 파일이 있는지 검사를 위한 변수
		var notecount = 0; // 정상적인 노트 파일이 폴더 내에 몇개나 있는지 검사하기 위한 변수
		
		filelist = Directory.GetFiles(folderlist[i]);// 폴더 안의 파일 리스트를 불러옵니다.
		
		for(var j = 0 ; j < filelist.length ; j++)
		{
			var tempnoteinfo = new NoteInfo(); // 패턴 정보를 저장할 NoteInfo형 객체 생성
			
			if(Path.GetFileName(filelist[j]) == "Normal.tgs") // 노멀 노트
			{
				tempsonginfo.normal = FileTest(filelist[j]); // 파일테스트 + 로드
				if(tempsonginfo.normal != null) // 파일 테스트를 통과해서 로드되었으면
					notecount++; // 정상적인 노트이므로 노트 카운트를 올림
			}	
			else if(Path.GetFileName(filelist[j]) == "Hard.tgs") 
			{
				tempsonginfo.hard = FileTest(filelist[j]);
				if(tempsonginfo.hard != null)
					notecount++;
			}
			else if(Path.GetFileName(filelist[j]) == "Oni.tgs") 
			{
				tempsonginfo.oni = FileTest(filelist[j]);		
				if(tempsonginfo.oni != null)
					notecount++;
			}
			else if(Path.GetFileName(filelist[j]) == "Song.ogg")
				songfile = true;
				
			//yield WaitForSeconds(0.1);
		}
		
		if(songfile == true && notecount > 0) // 노래 파일이 있고 + 노트 파일이 1개 이상일 경우
		{
			tempsonginfo.path = folderlist[i]; // 해당 폴더의 경로를 저장하고
			tempsongarray.push(tempsonginfo); // 노래 목록 배열에 저장
		}

		
	}
	
	musiclist = tempsongarray.ToBuiltin(SongInfo); // 노래를 다 읽어들였으면, 유니티 내장 배열로 전환(속도 향상을 위함)
	
	jsSelectSong.firstStart = true;
	Application.LoadLevel(1);
	
}
function FileTest(filepath : String) {
	var tempstring = "";
	var filetest : StreamReader;
	var fileok = true;
	
	var title : String;
	var level : int;
	var bpm : int;
	var starttime : float;
	var totalnote : int = 0;
	
	var readnoteinfo : NoteInfo = new NoteInfo();
	
	filetest = new StreamReader(filepath, System.Text.Encoding.Default);
	tempstring = filetest.ReadLine();
	
	if(tempstring != ":HEADER")
		return null;
	
	tempstring = filetest.ReadLine();
	if(tempstring.Length > 6 && tempstring.Substring(0, 6) == "#TITLE")
		title = tempstring.Substring(7);
	else
		return null;
	
	tempstring = filetest.ReadLine();
	if(tempstring.Length > 6 && tempstring.Substring(0, 6) == "#LEVEL")
		level = int.Parse(tempstring.Substring(7));
	else
		return null;
		
	tempstring = filetest.ReadLine();
	if(tempstring.Length > 4 && tempstring.Substring(0, 4) == "#BPM")
		bpm = int.Parse(tempstring.Substring(5));
	else	
		return null;
		
	tempstring = filetest.ReadLine();
	if(tempstring.Length > 10 && tempstring.Substring(0, 10) == "#STARTTIME")
		starttime = float.Parse(tempstring.Substring(11));
	else	
		return null;
		
	filetest.ReadLine();
	
	tempstring = filetest.ReadLine();
	if(tempstring.Length > 5 && tempstring.Substring(0, 5) != ":MAIN")
		return null;

	readnoteinfo.bpm = bpm;
	readnoteinfo.level = level;
	readnoteinfo.title = title;
	readnoteinfo.starttime = starttime;
	
	while(true) {
		tempstring = filetest.ReadLine();
		
		if(tempstring == null)
			break;
			
		for(var i=0;i<tempstring.length;i++) {
			if(tempstring.Substring(i, 1) != '0' && tempstring.Substring(i, 1) != 'S' && tempstring.Substring(i, 1) != 'D' && tempstring.Substring(i, 1) != 'X' && tempstring.Substring(i, 1) != 'Z') {
				totalnote++;			
			}
		}
	}
	readnoteinfo.totalnote = totalnote;	
	text2.text = filepath;
	
	return readnoteinfo;
}
function Update () {

}