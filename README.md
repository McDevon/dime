dime
====

Dime-kurssin projektityö

## Done

- Tiilet näkyvissä
- Hiirellä scrollattava pelialue rajoitetuilla reunoilla
- Kursori hiiren alla olevan ruudun ympärillä
- Klikkaamisen tunnistus ja erottelu scrollaamisesta
- Yksikkö-, tiili-, ja rakennustyypit
- Kuvat (ehkä väliaikaiset) tiilille
- Kuvat (ehkä väliaikaiset) rakennuksille
- Rakennukset näkyvät tiilien päällä
- Yksiköt näkyviin

## Todo

- Yksiköiden pathfinder
- Yksiköiden 'tekoäly' ja taistelu
- Yksiköiden resurssien keräys ja tuonti keräyspisteeseen
- Uuden laatan sijoittaminen
- Rakennusten ostaminen ja rakentaminen (tarvitaanko rakentajayksikköä?)
- Yksiköiden ostaminen rakennuksista
- Osittain rikkinäisen rakennuksen korjaaminen

## Synopsis

Peli on settlers-tyyppinen resurssienkeräyspeli.

Peliä pelataan Carcassonne-tyyppisellä pelilaudalla, jota kasvatetaan tietyin väliajoin pelaajalle annettavilla laatoilla.
Peli pysähtyy siksi aikaa kun pelaaja miettii laattansa paikkaa.
Alussa pelaajalle annetaan kaupungin keskusrakennus, pari keräily-yksikköä (ja tykkitorni?). Tasapainotuskysymys, mennään perstuntumalla ja kokeilemalla.
Pelaajalla on kaksi resurssia, marjat ja sienet. Molempia voi kerätä metsästä keräily-yksiköillä.

Osa uusista laatoista (mielellään vaikka aina ensimmäinen) sisältää vihollispisteitä, joista ilmestyy vähän väliä vihollisia pelaajan riesaksi. Ilmestymistahti voi kasvaa pelin edetessä.
Pelaajan on suojeltava tukikohtaansa vihollisilta ja kerättävä lisää resursseja voidakseen ylläpitää tukikohtaa, kunnes se lopulta väistämättä tuhoutuu.
Pelaajan taitoa voidaan mitata vaikka pisteytyksellä tai ajalla, jona tukikohta on pysynyt pystyssä.

## Sisältö

### Yksiköt

- Keräilijä-yksikkö resurssien keruuseen (voi olla myös rakentaja kuten AoE:n villagerit)
- (Taistelija-yksikkö puolustukseen)
- Vihollisyksiköitä erilaisista spawnereista (esim. karhu, vihollisheimolainen, susi)

### Laatat

Yhdelle laatalle voi rakentaa vain yhden rakennuksen.

- Aloituslaatta. Sisältää aloitusrakennuksen. Mahdollisesti myös aloitusyksiköt.
- Ruoholaatta. Perusalue, sille voi rakentaa ja sen läpi on helppo kulkea.
- Toinen ruoholaatta, eri näköinen, sama toiminnallisuus.
- Vuorilaatta. Vaikeakulkuinen, sille ei voi rakentaa rakennuksia.
- Sienimetsä. Hidaskulkuinen, sieltä voi kerätä sieniä (loppuvatko aikaa myöten?), ei voi rakentaa.
- Marjametsä. Kuten edellä, mutta sieltä voi kerätä marjoja.
- Karhumetsä. Sisältää karhuluolan, josta ilmestyy tietyn ajan välein vihollisia.

### Rakennukset

- Kyläkeskus. Sieltä voi ostaa uusia keräily-yksiköitä ja sinne voi kerätä molempia resursseja. Uusia kyläkeskuksia ei voi rakentaa. Jos kyläkeskus tuhoutuu, pelaaja häviää.
- Puolustustorni. Ampuu vihollisia, jotka tulevat lähelle. (range pitää määritellä)
- Marjojen keräyspiste. Tänne voi tuoda marjoja marjametsästä, jolloin ne siirtyvät pelaajan käytettäviin resursseihin.
- Sienten keräyspiste. Tänne voi tuoda sieniä sienimetsästä, jolloin ne siirtyvät pelaajan käytettäviin resursseihin.

- Karhuluola. Pelaaja ei voi rakentaa vihollisrakennuksia ja ne spawnaavat uusia vihollisia tietyin väliajoin.