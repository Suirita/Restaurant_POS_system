in receipt setting to change the receipt reference there should be a form with 4 imputs:
imput 1: Racine, text input
imput 2: Format de la date, select imput with 3 options: "Pas de date" value is "0", "Annee" value is 1, "Annee/Mois" value is 2
imput 3: Valeur du compteur, number imput
imput 4: Longueur du compteur, number imput

par defaut they should be set to:
by this api: get:https://preprod-axiobat.foliatech.app/omicron/api/Configuration/counter
perticulary this:
{\"documentType\":4,\"prefix\":\"DEVIS\",\"counterLength\":1,\"dateFormat\":1,\"counter\":100820}

and it cll this api: put:https://preprod-axiobat.foliatech.app/omicron/api/Configuration/counter
  with this body:{
    "value": "[{\"documentType\":1,\"prefix\":\"cl-\",\"counterLength\":6,\"dateFormat\":0,\"counter\":10993},{\"documentType\":2,\"prefix\":\"FRS-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":120},{\"documentType\":3,\"prefix\":\"HI232340\",\"counterLength\":5,\"dateFormat\":0,\"counter\":103},{\"documentType\":4,\"prefix\":\"DEVIS\",\"counterLength\":1,\"dateFormat\":1,\"counter\":100820},{\"documentType\":5,\"prefix\":\"FI\",\"counterLength\":3,\"dateFormat\":1,\"counter\":2025853},{\"documentType\":6,\"prefix\":\"FA061deee\",\"counterLength\":5,\"dateFormat\":0,\"counter\":123683},{\"documentType\":7,\"prefix\":\"AV-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":409},{\"documentType\":8,\"prefix\":\"BCF-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":345},{\"documentType\":9,\"prefix\":\"FIM-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":184},{\"documentType\":17,\"prefix\":\"CE/\",\"counterLength\":3,\"dateFormat\":1,\"counter\":95},{\"documentType\":108,\"prefix\":\"OB-\",\"counterLength\":3,\"dateFormat\":1,\"counter\":16},{\"documentType\":109,\"prefix\":\"DEL-\",\"counterLength\":3,\"dateFormat\":1,\"counter\":11},{\"documentType\":133,\"prefix\":\"BE-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":79},{\"documentType\":134,\"prefix\":\"BS-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":139},{\"documentType\":135,\"prefix\":\"DES-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":37},{\"documentType\":136,\"prefix\":\"DSS-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":47},{\"documentType\":139,\"prefix\":\"DAS-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":49},{\"documentType\":141,\"prefix\":\"BL-\",\"counterLength\":5,\"dateFormat\":0,\"counter\":32},{\"documentType\":148,\"prefix\":\"DPa-\",\"counterLength\":5,\"dateFormat\":1,\"counter\":46},{\"documentType\":160,\"prefix\":\"AVD-\",\"counterLength\":5,\"dateFormat\":1,\"counter\":22},{\"documentType\":10,\"prefix\":\"DEP-\",\"counterLength\":7,\"dateFormat\":2,\"counter\":164},{\"documentType\":15,\"prefix\":\"CH-\",\"counterLength\":5,\"dateFormat\":1,\"counter\":95},{\"documentType\":302,\"prefix\":\"PR-\",\"counterLength\":3,\"dateFormat\":1,\"counter\":33},{\"documentType\":303,\"prefix\":\"AFF-\",\"counterLength\":3,\"dateFormat\":1,\"counter\":40},{\"documentType\":304,\"prefix\":\"SE-\",\"counterLength\":3,\"dateFormat\":1,\"counter\":12}]"
}

the only thing that will change are {\"documentType\":4,\"prefix\":\"DEVIS\",\"counterLength\":1,\"dateFormat\":1,\"counter\":100820}
"documentType":4: will stay the same
"prefix":"DEVIS": is the Racine.
"dateFormat":1: is the format of the date.
"counter":100820: is the value of the counter.
"counterLength":1: is the length of the counter.
