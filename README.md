# exercice

Tests
====

`npm i`

`npm start`

Requête création promocode :

```
POST localhost:3000/promocode

{
	"advantage": 20,
	"name": "myPromoCode",
	"rules": [{
		"name": "weather",
		"restrictions": [{
			"is": "clear",
			"temp": {
				"gt": 15
			}
		}]
	}, {
		"name": "age",
		"restrictions": [{
			"eq": 40
		}, {
	        "lt": 30,
	        "gt": 15
    	}]
	}, {
		"name": "date",
		"restrictions": [{
			"after": "2017-05-02",
			"before": "2018-05-02"
		}]
	}]
}
```

Requête demande de réduction acceptée (si temps clair et temp supérieure à 15°):

```
POST localhost:3000/promocode/myPromoCode

{
	"args": {
		"age": 40,
		"date": "2018-05-01"
	}
}
```


Design
====

Le OR a été implémenté grâce aux tableaux de restrictions, si vous mettez plusieurs restrictions pour une règle, elles seront testée les unes à la suite des autres, si une des restrictions retourne vrai, les autres ne seront pas prises en compte. 
