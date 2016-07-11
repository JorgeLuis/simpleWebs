$(document).ready(function() {
  $("#simulacion").on("click", function() {
   simulacion();	
  });
});


function simulacion(){

	var N =2;
	var Ns =0;
	var ARR =0;
	var NT =0;
	Ia = ["30","45","50"];
  	
  	var TPS= ["HV","HV"];
	var i= buscarElMejorTPSi(TPS);
	var TPLL = "9:00";
	var T = "0:00";
	var Tfinal ="11:00";

	var STLL =["0:00","0:00"];
	var STA =["0:00","0:00"];
	var STO =["0:00","0:00"];
	var ITO =["0:00","0:00"];
	var STS =["0:00","0:00"];
	var POM =[0,0];
	var PTE =[0,0];

	Ia_i=obtenerIntervaloDeArribos(Ia);
	console.log("intervo de arribos: "+ Ia_i);

	
	do{
		
		var tipo = determinarTipo(TPLL,TPS[i]);console.log("Tipo de Evento: "+ tipo);
		if (tipo =="llegada"){//2) y 4) se determina el tipo de evento
				T=TPLL; //3)se avanza el tiempo hasta la proxima llegada
				
				
				TPLL=sumarTiempoMasIntervalo(T,Ia_i); //5)Evento futuro no condicionado
				
				
				if (Ns>= 5+N) {
					ARR= ARR+1;
				}else{
					NT=NT+1;
					Ns=Ns+1; //6)se actualiza el vertor de estado
				
					STLL[i] =sumatoriaDeTiempos(STLL[i],TPLL);
					
					if (Ns<=N) {
						var x = buscarTPSiIgualHV(TPS);
						var Ta = obtenerTiempoDeAtencion();

						STA[x] = sumarTiempoMasIntervalo(STA[x],Ta);
						
						TPS[x] = sumarTiempoMasIntervalo(T,Ta);
						STO[x] = sumatoriaDeTiempoOcioso(STO,T,ITO,x);
					};
				};
			}else{//es una salida
				
				T=TPS[i]; //3)se avanza al tiempo hasta la próxima salida
				
				STS[i]=sumatoriaDeTiempos(STS[i],T);
				Ns=Ns-1;
				
				if (Ns>=N) {
					var Ta = obtenerTiempoDeAtencion();
					TPS[i]=sumarTiempoMasIntervalo(T,Ta); 
					     //7)Evento futuro condicionado
					
					STA[i] =sumarTiempoMasIntervalo(STA[i],Ta);
					
				}else{
					TPS[i]= "HV";
					ITO[i]=T; 
				};
			}//fin del else	
			var condicion = compararTiempoFinal(T,Tfinal);	
			Ia_i=obtenerIntervaloDeArribos(Ia);
			console.log("intervo de arribos: "+ Ia_i);

			if (Ia_i==0) {
				break;
			};

	} while(condicion>0);//8)fin de la ejecucion
	

	console.log("--------------------");
	 //9)Calcular resultadosThings[i]
	console.log("STO[0]: "+STO[0]);
	console.log("STO[1]: "+STO[1]);

	var sto1 = pasarHoraANumeros(STO[0])*100/pasarHoraANumeros(T);
	var sto2 = pasarHoraANumeros(STO[1])*100/pasarHoraANumeros(T);

	console.log("sto1: "+sto1);
	console.log("sto2: "+sto2);
	
	var sts_1_2  = pasarHoraANumeros(STS[0])  + pasarHoraANumeros(STS[1]);
	var stll_1_2 = pasarHoraANumeros(STLL[0]) + pasarHoraANumeros(STLL[1]);
	var sta_1_2  = pasarHoraANumeros(STA[0])  + pasarHoraANumeros(STA[1]);
	 

	var ptet = (stll_1_2-sts_1_2-sta_1_2)* NT/100;
	var ptet_str = "%" + ptet.toString();
	$('#c1').val(sto1.toString());
	$('#c2').val(sto2.toString());
	$('#c3').val(ptet_str);
	
	
}

function pasarHoraANumeros(hora){
	var numero=0;

	var hora_minuto=hora.split(":",2);
	var hora_int= hora_minuto[0];
	var minu_int= hora_minuto[1];

	numero =  parseInt(hora_int) *60+ parseInt(minu_int);

	return numero;
}

function compararTiempoFinal(T,Tfinal){

	var valor=1;	
	var hora1=T.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	
	var hora2=Tfinal.split(":",2);
	var h2= hora2[0];
	var m2= hora2[1];

	var r_hora = parseInt(h2)-parseInt(h1);
  	var r_minu = parseInt(m2)-parseInt(m1);

  	if (r_hora==0) {
  		valor = -1;
  	};

  	//alert(r_hora);
  	return valor;
}

function sumatoriaDeTiempoOcioso(STO,T,ITO,x){

	//STO[x]= STO[x] + T -ITO[x];
	var p1 = sumatoriaDeTiempos(STO[x],T);
	var p2 = restaDeTiempos(p1,ITO[x]);
	return p2;
}


function sumarTiempoMasIntervalo(T,minutos){
	
	var hora1=T.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	var minu_int = parseInt(m1)+parseInt(minutos);
	var hora_int = parseInt(h1);
	var minutos_str="";

	if (minu_int>59) {
  		hora_int = hora_int +1;
  		minu_int = minu_int - 60;
  	}
  	
  	if (minu_int>9) {
  		minutos_str = minu_int.toString();
  	}else{
  	 		
  		minutos_str = "0"+minu_int.toString();
  	};
  	
  	
  	var texto =hora_int.toString()+":"+minutos_str;
  	console.log("sumar tiempo mas minutos: "+ T + " + "+ minutos +" minutos "+" = "+ texto);
	return texto;
}

function sumatoriaDeTiempos(valor1,valor2){

	var hora1=valor1.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	var hora2=valor2.split(":",2);
	var h2= hora2[0];
	var m2= hora2[1];

  	var hora_int = parseInt(h2)+parseInt(h1);
  	var minu_int = parseInt(m2)+parseInt(m1);
	
	var minutos="";

  	if (minu_int>59) {
  		hora_int = hora_int +1;
  		minu_int = minu_int - 60;
  	}
  	
  	if (minu_int>9) {
  		minutos = minu_int.toString(); 
  	}
  	else{
  		minutos = "0"+minu_int.toString();  		
  	};
  	
  	var texto =hora_int.toString()+":"+minutos;
  	console.log("sumatoria de tiempos:" +" T1: "+valor1+" + T2: "+valor2+" = "+ texto);
  	return texto;
}

function restaDeTiempos(valor1,valor2){

	var hora1=valor1.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	var hora2=valor2.split(":",2);
	var h2= hora2[0];
	var m2= hora2[1];

  	var r_hora = parseInt(h1)-parseInt(h2);
  	var minu_int = parseInt(m1)-parseInt(m2);

	var minutos="";
  	if (minu_int<0) {
  		r_hora = r_hora -1;
  		minu_int = minu_int +60;
  	}else{
 	
	  	if (minu_int<10) {
	  		minutos = "0"+minu_int.toString();
	  	}else{
	  		minutos = minu_int.toString();
	  	}
  	};
  	
  	var texto =r_hora.toString()+":"+minutos;
  	console.log("resta de tiempos:" +" T1: "+valor1+" - T2: "+valor2+" = "+ texto);
  	return texto;
}

function buscarElMejorTPSi(TPS){

	var posicion;
	var existe = buscarTPSiIgualHV(TPS);

	if (existe!=null) {
		posicion = existe;
	}else{
		posicion = obtenerMenorTiempo(TPS);
	};

	return posicion;
}

function determinarTipo(valor1,valor2){
	
	
	if (valor1=="HV") {
		return "salida";
	}else if (valor2=="HV"){
		return "llegada";
	};

	var hora1=valor1.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	
	var hora2=valor2.split(":",2);
	var h2= hora2[0];
	var m2= hora2[1];

	var num = parseInt(h2)-parseInt(h1);

	if (num>0) {
		return "llegada";
	}else{
		return "salida";
	};
}

function obtenerMenorTiempo(TPS){
	
	var contenidoTPS = TPS[0];
	var hora1=contenidoTPS.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	var contenido2 = TPS[1];
	var hora2=contenido2.split(":",2);
	var h2= hora2[0];
	var m2= hora2[1];

	var num = parseInt(h2)-parseInt(h1);

	if (num>0) {
		return 0;
	}else if(num==0){
		var minu = parseInt(m2)-parseInt(m1);
		if (minu>0) {
			return 0;
		}else{
			return 1;
		};
	};
}




function buscarTPSiIgualHV(TPS){

	var posicion = null;
	for (var i =  0; i < TPS.length; i++) {
		
		if (TPS[i]=="HV") {
			posicion = i;
			i=5;
		};
	};

	return posicion;
}



function obtenerIntervaloDeArribos(Ia){

	var valor;
	if (Ia.length>0) {
		valor=Ia.splice(0,1);
	}else{ valor=0;};
	
	return valor;
}

function obtenerTiempoDeAtencion(){

	return "30";
}