//HTML da la escrutura, escribe documentos
//CSS el estilo, a documentos
//Js el comportamient



//js es un lenguaje que maneja el comportamiento de la pagina 
//para el usuario.

//js no compila nada
//una variable es un dato, que guarda informacion
//el scrip es una funcion que se puede volver a utilizar  
$(document).ready(function(){// esto es una super funcion!!! genera un objeto jquey que manipula todos los elementos
  $('#ex1').zoom();

  
 $( "#analizador" ).on("click",function(){
 	analizarAlgoritmo();
 });  

});//esta funcion se ejecuta recien cuando se cargo el documento!!! groso!!!
//cuando el documento este cargado llamame a esta funcion!!!
//esta funcion es la parte de inicializacion


function buscarElMejorTPSi(){

	return 1;
}

function obtenerTiempoDeAtencion(){

	return 2;
}

function buscarElOITCorrespondiente(i){

	return 1;
}

function analizarAlgoritmo() {
	
	//1)Condiciones Iniciales
	var Ia=[1,2,35];
	var i =1;//esto hay que sacar;

	//Variables en funcion del tiempo
	var TPSi= buscarElMejorTPSi();
	var IOTi= buscarElOITCorrespondiente(i);
	var TPLL = 8;
	var T=0;
	var Tfinal;
	var STLL=0;
	var STOi=0;
	var STS=0;
	var STA=0;
	
	//Variables en enteras
	var N=0;
	var Ns=0;
	var ARR=0;
	var NT=0;

	 do{

		if (TPLL<TPSi){//2) y 4) se determina el tipo de evento
			T=TPLL; //3)se avanza el tiempo hasta la proxima llegada
			Ia=obtenerIntervaloDeArribos();
			TPLL=T+Ia; //5)Evento futuro no condicionado

			if (Ns>= 5+N) {
				NT=NT+1;
				Ns=Ns+1; //6)se actualiza el vertor de estado
				STLL=STLL+TPLL;

				if (Ns<=N) {
					TPSi=buscarElMejorTPSi();
					Ta=obtenerTiempoDeAtencion(); //7)Evento futuro condicionado
					STA=STA+Ta;
					TPSi=T+Ta;
					//STOi= obtener el STO del tiempo ocioso
					STOi=STOi+T-ITOi;
				};
			}else{
				ARR= ARR+1;
			};




			alert(TPLL);

		}else{//es una salida
			T=TPSi; //3)se avanza al tiempo hasta la próxima salida
			STS=STS+T;
			Ns=Ns-1;

			if (Ns>=N) {
				Ta=obtenerTiempoDeAtencion();
				TPSi=T+Ta;        //7)Evento futuro condicionado
				STA=STA+Ta;

			}else{
				TPSi= 1000;//H.v
				//IOTi=buscarElOITCorrespondiente(i);
				IOTi=T; 
			};
		}//fin del else
	} while(T>=Tfinal);//8)fin de la ejecucion

	if (Ns==0) {
		var POMi=STOi*100/T;  //9)Calcular resultados
		var PTE = (STS-STLL-STA) * 100/NT
	}else{//
		TPLL=1000;//H.V. //Ver que hacer!!!
	};

	//10)Mostrar resultados
	alert("LLego hasta el final: falta analizar más");

};



