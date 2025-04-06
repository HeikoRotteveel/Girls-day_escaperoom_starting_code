// Functie om het autootje rechtdoor te laten rijden
function rijd_rechtdoor () {
    // Zet beide LED-lichtjes aan de voorkant uit
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
    // Laat de linker motor iets sneller of langzamer draaien dan de rechter, om recht te rijden
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, snelheid + 0)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, snelheid)
    // Wacht heel even voordat het programma doorgaat
    basic.pause(10)
}
// Als je tegelijk op knop A en B drukt, wordt het kompas opnieuw gekalibreerd
input.onButtonPressed(Button.AB, function () {
    input.calibrateCompass()
})
// Hulpfunctie om te controleren of het autootje de gewenste richting heeft bereikt
function hoek_bereikt (target: number) {
    // Lees de huidige richting van het kompas (0-360 graden)
    huidigeHoek = input.compassHeading()
    // Bereken het verschil tussen de gewenste hoek en de huidige hoek
    verschil = Math.abs(target - huidigeHoek)
    // Controleer of het verschil klein genoeg is (bijv. minder dan 5 graden),
    // of dat we net over de 0° heen zijn (bijv. 358° vs. 2°)
    return verschil < 15 || verschil > 345
}
// Functie om het autootje 90 graden naar rechts te laten draaien
function sla_rechtsaf () {
    // Bepaal de richting waar we vandaan beginnen
    beginhoek = input.compassHeading()
    // Bepaal wat de nieuwe hoek moet worden na 90 graden rechts
    doelhoek = (beginhoek + 90) % 360
    // Zet de rechter LED aan om te laten zien dat we rechtsaf slaan
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
    // Laat het linkerwiel vooruit draaien en het rechterwiel achteruit
    // Zo draait het autootje naar rechts
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, snelheid)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, snelheid)
    // Blijf draaien totdat de gewenste hoek bereikt is
    while (!(hoek_bereikt(doelhoek))) {
        // wacht steeds 50 milliseconden
        basic.pause(50)
    }
    // Stop beide motoren
    maqueen.motorStop(maqueen.Motors.All)
    // Zet de rechter LED weer uit
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
}
// Functie om het autootje 90 graden naar links te laten draaien
function sla_linksaf () {
    beginhoek = input.compassHeading()
    // Omdat we naar links gaan, moeten we 90 graden terug, dus -90.
    // We tellen er 360 bij op zodat het nooit een negatief getal wordt,
    // en nemen daarna de rest van deling door 360 (modulo)
    doelhoek = (beginhoek - 90 + 360) % 360
    // Zet de linker LED aan om te laten zien dat we linksaf slaan
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
    // Laat het linkerwiel achteruit draaien en het rechterwiel vooruit
    // Zo draait het autootje naar links
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, snelheid)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, snelheid)
    // Blijf draaien totdat de gewenste hoek bereikt is
    while (!(hoek_bereikt(doelhoek))) {
        basic.pause(50)
    }
    // Stop beide motoren
    maqueen.motorStop(maqueen.Motors.All)
    // Zet de linker LED weer uit
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
}
let Rechts = false
let doelhoek = 0
let beginhoek = 0
let verschil = 0
let huidigeHoek = 0
let snelheid = 0
// Hoe snel de motoren draaien
// Zet de snelheid van het autootje
snelheid = 30
// Dit is de hoofdlus die steeds opnieuw draait
basic.forever(function () {
    // Meet de afstand tot een object voor het autootje
    if (maqueen.Ultrasonic() < 10) {
        // Als er iets dichterbij is dan 10 cm, kies dan willekeurig links of rechts
        Rechts = Math.randomBoolean()
        if (Rechts) {
            sla_rechtsaf()
        } else {
            sla_linksaf()
        }
    } else {
        // Als er geen obstakel is, blijf dan rechtdoor rijden
        rijd_rechtdoor()
    }
})
