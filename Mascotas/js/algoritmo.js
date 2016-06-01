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

  
 $("#analizador").on("click",function(){
 	analizarAlgoritmo();
 });  

});//esta funcion se ejecuta recien cuando se cargo el documento!!! groso!!!
//cuando el documento este cargado llamame a esta funcion!!!
//esta funcion es la parte de inicializacion


function buscarElMejorTPSi(TPS_i){

	var tpsi=Math.min.apply(null, TPS_i);
	return tpsi;
}

function obtenerTiempoDeAtencion(){

	return 2;
}

function buscarElOITCorrespondiente(i){

	return 1;
}

function obtenerIntervaloDeArribos(Ia){

	var valor;
	if (Ia.length>0) {
		valor=Ia.splice(0,1);
	}else{ valor=0;};
	
	return valor;
}

function analizarAlgoritmo() {
	
	//1)Condiciones Iniciales
	var I_A=[1,2,35];
	var TPS_i= [100,101,102];
	
	//Variables en funcion del tiempo
	var TPSi= buscarElMejorTPSi(TPS_i);
	var ITOi= buscarElOITCorrespondiente(TPS_i);
	var TPLL = 8;
	var T=0;
	var Tfinal= 20;
	var STLL=0;
	var STOi=0;
	var STS=0;
	var STA=0;
	
	//Variables en enteras
	var N=3;
	var Ns=0;
	var ARR=0;
	var NT=0;


	//resultados
	var POMi=0;
	var PTE =0;

	do{
		do{
			if (TPLL<TPSi){//2) y 4) se determina el tipo de evento
				T=TPLL; //3)se avanza el tiempo hasta la proxima llegada
				Ia_i=obtenerIntervaloDeArribos(I_A);
				//console.log("Ia_i: "+Ia_i);
				TPLL=parseInt(T)+parseInt(Ia_i); //5)Evento futuro no condicionado

				if (Ns>= 5+N) {
					ARR= ARR+1;
				}else{
					NT=NT+1;
					Ns=Ns+1; //6)se actualiza el vertor de estado
					
					STLL = parseInt(STLL)+parseInt(TPLL);

					//console.log("1)STLL: "+STLL);

					if (Ns<=N) {
						//TPSi=buscarElMejorTPSi();
						Ta=obtenerTiempoDeAtencion(); //7)Evento futuro condicionado
						STA=parseInt(STA)+parseInt(Ta);
						TPSi=T+Ta;
						//alert("TPSi"+TPSi);
						//STOi= obtener el STO del tiempo ocioso
						STOi=STOi+T-ITOi;
					};
				};
			}else{//es una salida

				//console.log("TPSi: "+TPSi);
				T=TPSi; //3)se avanza al tiempo hasta la próxima salida
				//alert("T"+T);
				STS=parseInt(STS)+parseInt(T);
				Ns=Ns-1;
				
				if (Ns>=N) {
					Ta=obtenerTiempoDeAtencion();
					TPSi=T+Ta;        //7)Evento futuro condicionado
					STA=parseInt(STA)+parseInt(Ta);
				}else{
					TPSi= 10000;//H.v
					ITOi=T; 
				};
			}//fin del else			
		} while(T<=Tfinal);//8)fin de la ejecucion

		console.log("STS: "+STS);
		console.log("STLL: "+STLL);
		console.log("STA: "+STA);
		console.log("NT: "+NT);

		if (STS>10000) {
			STS =STS - 10000;
		};
		
		if (Ns==0) {
			POMi=STOi*100/T;  //9)Calcular resultados
			PTE = (STLL-STS-STA) * 100/NT;
			TPLL=100001;
		}else{//
			TPLL=10000;//H.V. //Ver que hacer!!!
		};

	}while(TPLL==10000);

	
	//10)Mostrar resultados
	$('#c1').val(POMi);
	$('#c2').val(PTE);

};



