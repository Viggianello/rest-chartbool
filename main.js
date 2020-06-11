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
    var numero_porta_personale= '4033';
    var url_api= 'http://157.230.17.132:'+ numero_porta_personale +'/sales';
    // imposto la lingua italiana per moment
    moment.locale('it');
	//Chiamata ajax
    $.ajax({
        // qui parte l'oggetto dei dischi dieci musicali
        'url': url_api,
        'method': 'GET',
        'success': function(vendite) {
            console.log(vendite);
            var dati_vendite_mensili = prepara_dati_vendite_mensili(vendite);
            var mesi = Object.keys(dati_vendite_mensili);
            var dati_mesi = Object.values(dati_vendite_mensili);
            disegna_grafico_vendite_mensili(mesi, dati_mesi);
        },
        'error': function() {
            console.log('si è verificato un errore');
        }// fine oggetto
    });// fine chiamata ajax

    function prepara_dati_vendite_mensili(dati) {
        var vendite_mensili ={
            'gennaio': 0,
            'febbraio': 0,
            'marzo': 0,
            'aprile': 0,
            'maggio': 0,
            'giugno': 0,
            'luglio': 0,
            'agosto': 0,
            'settembre': 0,
            'ottobre': 0,
            'novembre': 0,
            'dicembre': 0,
        }
        for (var i = 0; i < dati.length; i++) {
            var vendita_corrente = dati[i]
            console.log(vendita_corrente);
            var importo_vendita_corrente = vendita_corrente.amount;
            console.log(importo_vendita_corrente);
            var data_corrente = moment(vendita_corrente.date, "DD/M/YYYY");
            console.log(data_corrente);
            var mese_corrente = data_corrente.format('MMMM');
            console.log(mese_corrente);
            // incremento i valori di vendite per ogni mese corrente
            vendite_mensili[mese_corrente]+= importo_vendita_corrente;
        }
        return vendite_mensili;
    }
    function disegna_grafico_vendite_mensili(etichette, dati) {
        // devo perforza metterlo qui xke ajax è asincrona e farei fatica a gestire i dati
        var ctx = $('#myChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                // nomi dei mesi
                labels: etichette,
                datasets: [{
                    label: 'Vendite totali ripartite nei mesi del 2017',
                    data: dati,
                    // tira via il colore interno
                    fill: false,
                }]
            },
        });
    }
    function prepara_dati_vendite_venditori(dati) {
        var vendite_venditori = {}
        var totale_vendite = 0;
        for (var i = 0; i < dati.length; i++) {
            var vendita_corrente = dati[i]
            // console.log(vendita_corrente);
            var importo_vendita_corrente = vendita_corrente.amount;
            console.log(importo_vendita_corrente);
            var nome_corrente = vendita_corrente.salesman;
            console.log(nome_corrente);
            // incremento i valori di vendite per ogni mese corrente
            vendite_mensili[mese_corrente]+= importo_vendita_corrente;
            if (!vendite_venditori.hasOwnProperty(nome_corrente)) {
                vendite_venditori[nome_corrente]= importo_vendita_corrente;
            }
            else {
                vendite_venditori[nome_corrente] += importo_vendita_corrente;
            }
            tatale_vendite += importo_vendita_corrente;
        }
        for (var nome_venditore in vendite_venditori) {
            var importo_venditore = vendite_venditori[nome_venditore];
            var percentuale_venditore = importo_venditore *100 / totale_vendite.toFixed(1);
        }
        return vendite_venditori;
    }
    function disegna_grafico_vendite_venditori(etichette, dati) {
        var ctx = $('#myChart');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                // nomi dei venditori
                labels: etichette,
                datasets: [{
                    label: 'Vendite totali ripartite dai venditori nel 2017',
                    data: dati,
                }]
            },
        });
    }
});
