class hijriDate{

	static wdNames = ["Sunday","Monday",'Tuesday',"Wednesday","Thursday","Friday","Saturday"];
	static iMonthNames = ["Muharram","Safar","Rabi'ul Awwal","Rabi'ul Akhir",
	"Jumadal Ula","Jumadal Akhira","Rajab","Sha'ban",
	"Ramadan","Shawwal","Dhul Qa'ada","Dhul Hijja"];
	
    constructor(date){
        let myDate = kuwaiticalendar(date, 0);
		this.gd = myDate[0];
		this.gm = myDate[1];
		this.gy = myDate[2];
		this.jd = myDate[3];
		this.dayOfWeek = myDate[4];
		this.hd = myDate[5];
		this.hm = myDate[6];
		this.hy = myDate[7];
        this.gregDate = date;
    }

	static getHijriDate(year, month, day){
		const today = new hijriDate(new Date());
		var days = getDifference({d: today.hd,m: today.hm+1, y: today.hy},
			{d: day, m: month, y: year});
		var gregDate = new Date();
		var newDateInMili = gregDate.getTime()+days*24*60*60*1000;
	
		return new hijriDate(new Date(newDateInMili));
	}

    getFirstDateOfMonth(){
        const firstDate = this.gregDate.getTime() - ((this.hd-1)*1000*60*60*24);
        return new hijriDate(new Date(firstDate));
    }
    getFirstDateOfNextMonth(){
        const lastDate = this.gregDate.getTime() + ((
        getNumDaysInMonth(this.hy,this.hm)-
        this.hd+1)*1000*60*60*24);

        return new hijriDate(new Date(lastDate));
    }
	printPretty(){
		var outputIslamicDate = hijriDate.wdNames[this.dayOfWeek] + ", " 
		+ this.hd + " " + hijriDate.iMonthNames[this.hm] + " " + this.hy + " AH";
		return outputIslamicDate;
	}
}

function gmod(n,m){
	return ((n%m)+m)%m;
}

function kuwaiticalendar(date, adjust){
	var today = date;

	if(adjust) {
		adjustmili = 1000*60*60*24*adjust; 
		todaymili = today.getTime()+adjustmili;
		today = new Date(todaymili);
	}
	day = today.getDate();
	month = today.getMonth();
	year = today.getFullYear();
	m = month+1;
	y = year;
	if(m<3) {
		y -= 1;
		m += 12;
	}

	a = Math.floor(y/100.);
	b = 2-a+Math.floor(a/4.);
	if(y<1583) b = 0;
	if(y==1582) {
		if(m>10)  b = -10;
		if(m==10) {
			b = 0;
			if(day>4) b = -10;
		}
	}

	jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;

	b = 0;
	if(jd>2299160){
		a = Math.floor((jd-1867216.25)/36524.25);
		b = 1+a-Math.floor(a/4.);
	}
	bb = jd+b+1524;
	cc = Math.floor((bb-122.1)/365.25);
	dd = Math.floor(365.25*cc);
	ee = Math.floor((bb-dd)/30.6001);
	day =(bb-dd)-Math.floor(30.6001*ee);
	month = ee-1;
	if(ee>13) {
		cc += 1;
		month = ee-13;
	}
	year = cc-4716;

	if(adjust) {
		wd = gmod(jd+1-adjust,7)+1;
	} else {
		wd = gmod(jd+1,7)+1;
	}

	iyear = 10631./30.;
	epochastro = 1948084;
	epochcivil = 1948085;

	shift1 = 8.01/60.;
	
	z = jd-epochastro;
	cyc = Math.floor(z/10631.);
	z = z-10631*cyc;
	j = Math.floor((z-shift1)/iyear);
	iy = 30*cyc+j;
	z = z-Math.floor(j*iyear+shift1);
	im = Math.floor((z+28.5001)/29.5);
	if(im==13) im = 12;
	id = z-Math.floor(29.5001*im-29);

	var myRes = new Array(8);

	myRes[0] = day; //calculated day (CE)
	myRes[1] = month-1; //calculated month (CE)
	myRes[2] = year; //calculated year (CE)
	myRes[3] = jd-1; //julian day number
	myRes[4] = wd-1; //weekday number
	myRes[5] = id; //islamic date
	myRes[6] = im-1; //islamic month
	myRes[7] = iy; //islamic year

	return myRes;
}

const getNumDaysInMonth = (year, monthNumber) => {
    if(year%3 === 2 && monthNumber+1 === 12){
        return 30;
    }
    else if((monthNumber+1)%2 === 0){
        return 29;
    }
    else {
        return 30;
    }
}

function countLeapYears(d)
{
	var years = d.y;
	return (years)/3;
}

function getDifference(dt1, dt2)
{
	monthDays=[ 30, 29, 30, 29, 30, 29,
		30, 29, 30, 29, 30, 29 ];
	var n1 = dt1.y * 354 + dt1.d;

	for (var i = 0; i < dt1.m - 1; i++)
		n1 += monthDays[i];
		
	n1 += countLeapYears(dt1);
	n1=Math.floor(n1);

	var n2 = dt2.y * 354 + dt2.d;
	for (i = 0; i < dt2.m - 1; i++)
		n2 += monthDays[i];
	n2 += countLeapYears(dt2);
	n2=Math.floor(n2);

	return (n2 - n1);
}



//let today = getGregDate(1444,12,28);
//console.log(today.printPretty());

// let today = new hijriDate(new Date(1999, 1, 3));
// console.log(today.printPretty());

export {hijriDate};