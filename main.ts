function rij_rechtdoor () {
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, snelheid + 2)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, snelheid)
    basic.pause(10)
}
// Helperfunctie om te checken of we dichtbij de doelhoek zijn
function hoek_bereikt (target: number) {
    huidigeHoek = input.compassHeading()
    verschil = Math.abs(target - huidigeHoek)
    // Houdt rekening met 0°-360° overgangen
    return verschil < 5 || verschil > 355
}
function sla_rechtsaf () {
    beginhoek = input.compassHeading()
    // Bereken correcte doelhoek
    doelhoek = (beginhoek + 90) % 360
    // Rechter LED aan
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
    // Linkerwiel vooruit, rechterwiel achteruit -> draai naar rechts
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, snelheid)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, snelheid)
    while (!(hoek_bereikt(doelhoek))) {
        // Check elke 50 ms, voorkomt te snelle updates
        basic.pause(50)
    }
    maqueen.motorStop(maqueen.Motors.All)
    // LED uit
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
}
function sla_linksaf () {
    beginhoek = input.compassHeading()
    // Correcte berekening
    doelhoek = (beginhoek - 90 + 360) % 360
    // Linker LED aan
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
    // Linkerwiel achteruit, rechterwiel vooruit -> draai naar links
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, snelheid)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, snelheid)
    while (!(hoek_bereikt(doelhoek))) {
        // Check elke 50 ms
        basic.pause(50)
    }
    maqueen.motorStop(maqueen.Motors.All)
    // LED uit
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
}
let Rechts = false
let doelhoek = 0
let beginhoek = 0
let verschil = 0
let huidigeHoek = 0
let snelheid = 0
// Pas snelheid aan indien nodig
snelheid = 30
// Pas snelheid aan indien nodig
basic.forever(function () {
    if (maqueen.Ultrasonic() < 8) {
        Rechts = Math.randomBoolean()
        if (Rechts) {
            sla_rechtsaf()
        } else {
            sla_linksaf()
        }
    } else {
        rij_rechtdoor()
    }
})
