// Utilizziamo la libreria chart.js per creare dei bellissimi grafici che mostreranno dei dati aggregati :nerd_face:
// Fate una chiamata ajax per recuperare la lista di vendite fatte dai venditori di un'azienda nel 2017
// L'endpoint è lo stesso per tutti ma avrete ciascuno una porta diversa (trovate il vostro url completo nel file che vi allego):
// http://157.230.17.132:[numero_porta_personale]/sales
// Con questi dati create:
// un grafico a linee per rappresentare le vendite di ogni mese (occhio alla gestione dei colori)
// un grafico a torta per rappresentare le vendite di ogni venditore
// Vi consiglio di utilizzare la libreria moment.js per manipolare le date.
// Nome repo: rest-chartbool


$(document).ready(function() {
    // creo un oggetto dove mettere tutti i mesi ove ci son state vendite
    var chiavi_mesi = {};
	//Chiamata ajax
    $.ajax({
        // qui parte l'oggetto dei dischi dieci musicali
        'url': 'http://157.230.17.132:4033/sales',
        'method': 'GET',
        'success': function(vendite) {
            console.log(vendite);
            for (var i = 0; i < vendite.length; i++) {
                var vendita = vendite[i]
                console.log(vendita);
                var numero_vendita_corrente = vendita.amount;
                console.log(numero_vendita_corrente);
                var data_corrente = moment(vendita.date, "DD/M/YYYY");
                console.log(data_corrente);
                var mese_corrente = data_corrente.format('MM');
                console.log(mese_corrente);
                if (!chiavi_mesi.hasOwnProperty(mese_corrente)) {
                    chiavi_mesi[mese_corrente]= numero_vendita_corrente;
                }
                else {
                    chiavi_mesi[mese_corrente] += numero_vendita_corrente;
                }
                console.log(chiavi_mesi);
            }
            var chiavi = Object.keys(chiavi_mesi);
            console.log(chiavi);
            var valori = Object.values(chiavi_mesi);
            console.log(valori);
        }// fine oggetto

    });

    var ctx = $('#myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // nomi dei mesi
            labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno'],
            datasets: [{
                label: 'Vendite per ogni mese',
                // dati vendita
                data: [12, 19, 3, 5, 2, 3],

            }]
        },
    });
});
