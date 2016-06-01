$(document).ready(function() {
  $("#analizador").on("click", function() {
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

	do{
		
		var tipo = determinarTipo(TPLL,TPS[i]);alert(tipo);
		if (tipo =="llegada"){//2) y 4) se determina el tipo de evento
				T=TPLL; //3)se avanza el tiempo hasta la proxima llegada
				Ia_i=obtenerIntervaloDeArribos(Ia);

				if (Ia_i==0) {
					break;
				};
				
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
					alert(STA[i]);
					STA[i] =sumarTiempoMasIntervalo(STA[i],Ta);
					alert(STA[i]);
				}else{
					TPS[i]= "HV";
					ITO[i]=T; 
				};
			}//fin del else	
			var condicion = compararTiempoFinal(T,Tfinal);		
	} while(condicion>0);//8)fin de la ejecucion
	
	if (Ns==0) {
			//POMi=STOi*100/T;  //9)Calcular resultados
			//PTE = (STLL-STS-STA) * 100/NT;
			alert(111111);
	};


	
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
	
	var r_minu = parseInt(m1)+parseInt(minutos);
	

	if (r_minu>59) {
  		h1 = parseInt(h1) +1;
  		r_minu = r_minu - 60;

  		if (r_minu<10) {
  			var minu = "0" + r_minu.toString();
  		}else{
  			var minu = r_minu.toString();
  		};

  	};
  	
  	console.log(minu);
  	var texto =h1.toString()+":"+minu;
	return texto;
}

function sumatoriaDeTiempos(valor1,valor2){

	var hora1=valor1.split(":",2);
	var h1= hora1[0];
	var m1= hora1[1];
	
	var hora2=valor2.split(":",2);
	var h2= hora2[0];
	var m2= hora2[1];

  	var r_hora = parseInt(h2)+parseInt(h1);
  	var r_minu = parseInt(m2)+parseInt(m1);

  	if (r_minu>59) {
  		r_hora = r_hora +1;
  		r_minu = r_minu - 60;
  	};

  	alert(r_minu);

  	var minutos="";
  	if (r_minu<10) {
  		minutos = "0"+r_minu.toString();alert("1) "+minutos);
  	}else{
  		minutos = r_minu.toString(); alert("2) "+ r_minu.toString());
  	};
  	
  	var texto =r_hora.toString()+":"+minutos;
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
  	var r_minu = parseInt(m1)-parseInt(m2);

  	if (r_minu<0) {
  		r_hora = r_hora -1;
  		r_minu = r_minu +60;
  	};


  	var minutos="";
  	if (r_minu<10) {
  		minutos = "0"+r_minu.toString();
  	}else{
  		minutos = r_minu.toString();
  	};
  	
  	var texto =r_hora.toString()+":"+minutos;
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
	for (var i =  1; i <= TPS.length; i++) {
		
		if (TPS[i]=="HV") {
			posicion = i;
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