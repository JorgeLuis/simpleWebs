using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EjemploWeb.Controllers
{
    public class PruebaController : Controller
    {
        //El controlador es el que llama a la Vistas!!!
        //Se puede hacer controles feos directos y se los pone en la url
        //Las acciones de controladores son publicas
        //ActionResul que se espera de esta action, es lo mismo que poner String
        //Siempre en cada controlador, al menos se tiene que devolver algo
        // GET: Prueba
        public ActionResult Index()
        {
            return View();
        }

        //se hacen tres puntos de entrada, mejor dicho acciones.
        // GET: Pagina
        public ActionResult Pagina()
        {
            return View("/Views/CarpetaPrueba/pagina.cshtml");
        }

        // GET: Pagina2
        public ActionResult Pagina2()
        {
            return View("/Views/CarpetaPrueba/pagina2.cshtml");
        }

        // GET: Pagina3
        public ActionResult Pagina3()
        {
            return View("/Views/CarpetaPrueba/pagina3.cshtml");
        }

        // GET: devuelve el texto ingresado
        //ir a la url:  localhost:49457/Prueba/DameUnTexto
        public String DameUnTexto()
        {
            return "Texto";
        }
    }
}