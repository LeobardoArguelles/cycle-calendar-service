Cycle Calendar Service

Microservicio en Node.js que calcula un calendario menstrual estimado y lo devuelve como imagen PNG.

Qué hace

Este servicio recibe datos básicos del ciclo por HTTP, calcula:
	•	días estimados de menstruación
	•	día estimado de ovulación
	•	ventana fértil estimada
	•	un rango visual de 6 semanas

Luego genera una imagen PNG de calendario usando un SVG interno.

⸻

Endpoints disponibles

GET /health

Sirve para validar que el servicio está corriendo.

Respuesta:

{
  "ok": true
}

POST /render-cycle-calendar

Genera y devuelve una imagen PNG del calendario.

Content-Type:

application/json

Body esperado:

{
  "cycle_start": "2026-03-27",
  "cycle_length": 28,
  "period_length": 5
}

Respuesta:
	•	image/png

POST /render-cycle-calendar-json

Genera el calendario, pero en vez de devolver el PNG directo, devuelve un JSON útil para debug o integración.

Body esperado:

{
  "cycle_start": "2026-03-27",
  "cycle_length": 28,
  "period_length": 5
}

Respuesta ejemplo:

{
  "summary": {
    "ovulation_date": "2026-04-10",
    "fertile_start": "2026-04-05",
    "fertile_end": "2026-04-10",
    "period_end": "2026-03-31"
  },
  "svg": "<svg ...>",
  "png_base64": "iVBORw0KGgoAAA..."
}


⸻

Parámetros que debes enviar

cycle_start

Tipo: string
Formato esperado: YYYY-MM-DD

Es la fecha de inicio del ciclo. En la lógica actual, también se usa como inicio estimado de la menstruación.

Ejemplo:

"cycle_start": "2026-03-27"

Cómo afecta el resultado

Este parámetro mueve todo el calendario:
	•	el inicio de la menstruación estimada
	•	la fecha estimada de ovulación
	•	la ventana fértil
	•	el rango visual mostrado en la imagen

Si cambias cycle_start, todo el calendario se recorre.

⸻

cycle_length

Tipo: number
Valor común: 28

Es la duración estimada del ciclo completo en días.

Ejemplo:

"cycle_length": 28

Cómo afecta el resultado

Este parámetro afecta principalmente la ovulación y los días fértiles.

La lógica actual calcula la ovulación así:

ovulación = cycle_start + (cycle_length - 14)

Entonces:
	•	si el ciclo es más largo, la ovulación se mueve más hacia adelante
	•	si el ciclo es más corto, la ovulación ocurre antes
	•	la ventana fértil también se mueve junto con esa fecha

Ejemplo rápido
Con:

{
  "cycle_start": "2026-03-27",
  "cycle_length": 28
}

la ovulación se estima 14 días después del inicio.

Con:

{
  "cycle_start": "2026-03-27",
  "cycle_length": 32
}

la ovulación se mueve 4 días más adelante respecto al ejemplo anterior.

⸻

period_length

Tipo: number
Valor común: 5

Es la duración estimada de la menstruación en días.

Ejemplo:

"period_length": 5

Cómo afecta el resultado

Este parámetro solo afecta cuántos días se pintan como menstruación.

Ejemplo:
	•	period_length: 3 → se colorean 3 días al inicio
	•	period_length: 5 → se colorean 5 días
	•	period_length: 7 → se colorean 7 días

No cambia directamente el día de ovulación en esta versión del servicio.

⸻

Lógica actual del cálculo

La lógica del servicio es una estimación simple, útil para visualización o automatización básica.

Menstruación

Se pinta desde cycle_start durante period_length días.

Ovulación

Se estima con esta fórmula:

cycle_start + (cycle_length - 14)

Ventana fértil

Se marca como:
	•	5 días antes de la ovulación
	•	el día de ovulación

En total, se pintan 6 días relacionados con fertilidad, donde el día exacto de ovulación tiene su propio color.

⸻

Colores usados

En la implementación actual:
	•	Rosa → menstruación
	•	Verde → días fértiles
	•	Azul → ovulación
	•	Blanco → días sin marca

⸻

Cómo se ve el calendario

La imagen no está organizada por “mes completo”.

En vez de eso, muestra un rango fijo de 6 semanas con columnas de lunes a domingo. Esto ayuda mucho cuando:
	•	el periodo cruza de un mes a otro
	•	la ovulación cae en el mes siguiente
	•	quieres una visualización continua en vez de dos calendarios separados

El rango visible arranca desde el lunes de la semana cercana al inicio del ciclo.

⸻

Ejemplos de uso

1. Health check

curl http://localhost:3000/health

2. Generar PNG

curl -X POST http://localhost:3000/render-cycle-calendar \
  -H "Content-Type: application/json" \
  -d '{"cycle_start":"2026-03-27","cycle_length":28,"period_length":5}' \
  --output calendario.png

3. Obtener JSON de debug

curl -X POST http://localhost:3000/render-cycle-calendar-json \
  -H "Content-Type: application/json" \
  -d '{"cycle_start":"2026-03-27","cycle_length":28,"period_length":5}'


⸻

Errores comunes

cycle_start faltante

Si no mandas cycle_start, el servicio falla porque es obligatorio.

cycle_start inválido

Debe venir en formato tipo:

"2026-03-27"

No envíes formatos ambiguos como:

"03/27/2026"


⸻

Notas importantes
	•	Esta lógica es estimada y no sustituye seguimiento médico ni métodos clínicos.
	•	Está pensada para visualización automática en bots, apps o flujos de backend.
	•	Si luego quieres mayor precisión, puedes cambiar la capa de cálculo sin tocar la parte visual.

⸻

Flujo recomendado de integración

Si luego lo conectas a otro sistema, el flujo típico sería:
	1.	un bot o formulario captura cycle_start, cycle_length y period_length
	2.	hace un POST a este microservicio
	3.	recibe una imagen PNG o un JSON con resumen
	4.	envía el resultado al usuario final

⸻

Resumen rápido de parámetros

Parámetro	Tipo	Obligatorio	Efecto
cycle_start	string YYYY-MM-DD	Sí	Mueve todo el calendario
cycle_length	number	No	Cambia ovulación y días fértiles
period_length	number	No	Cambia cuántos días se pintan como menstruación


⸻

Valor por defecto actual

Si omites algunos parámetros, la lógica usa:
	•	cycle_length = 28
	•	period_length = 5

Pero cycle_start sí debe venir siempre.
