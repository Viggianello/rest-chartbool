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
            /* grafico vendite mensili */
            var dati_vendite_mensili = prepara_dati_vendite_mensili(vendite);
            var mesi = Object.keys(dati_vendite_mensili);
            var dati_mesi = Object.values(dati_vendite_mensili);
            disegna_grafico_vendite_mensili(mesi, dati_mesi);

            /* grafico vendite venditore */
            // costruisco un oggetto che mappa i venditori con il totale delle vendite
            var dati_vendite_venditori = prepara_dati_vendite_venditori(vendite);
            // estraggo le chiavi, che saranno le etichette del grafico
            var nomi_venditori = Object.keys(dati_vendite_venditori);
            // estraggo i valori, che saranno i dati del grafico
            var dati_venditori = Object.values(dati_vendite_venditori);
            // disegno il grafico passandogli le etichette e i dati
            disegna_grafico_vendite_venditori(nomi_venditori, dati_venditori);
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
            if (!vendite_venditori.hasOwnProperty(nome_corrente)) {
                vendite_venditori[nome_corrente]= importo_vendita_corrente;
            }
            else {
                vendite_venditori[nome_corrente] += importo_vendita_corrente;
            }
            totale_vendite += importo_vendita_corrente;
        }
        for (var nome_venditore in vendite_venditori) {
            // recupero l'importo totale di questo venditore
            var importo_venditore = vendite_venditori[nome_venditore];
            // calcolo la percentuale delle sue vendite sul totale
            var percentuale_venditore = importo_venditore *100 / totale_vendite.toFixed(1);
            // imposto la sua percetuale come valore
            vendite_venditori[nome_venditore] = percentuale_venditore;
        }
        return vendite_venditori;
    }
    function disegna_grafico_vendite_venditori(etichette, dati) {
        var ctx = $('#myChart2');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: etichette,
                datasets: [{
                    label: 'importi vendite',
                    data: dati,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }
});
