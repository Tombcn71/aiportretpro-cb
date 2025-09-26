"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Globe, ArrowLeft, ArrowRight, MapPin } from "lucide-react"
import Header from "@/components/header"

// Echte fotografen uit Google zoekresultaten
const photographersData: { [key: string]: any[] } = {
  amsterdam: [
    {
      id: 1,
      name: "Profielfoto Amsterdam",
      description: "Professionele fotostudio gespecialiseerd in profielfoto's en zakelijke portretten",
      website: "profielfotografie.nl"
    },
    {
      id: 2,
      name: "Saskia Bakker Fotografie",
      description: "Zakelijke portretten, bedrijfsfoto's, teamfoto's en LinkedIn profielfoto's",
      website: "saskiabakkerfotografie.nl"
    },
    {
      id: 3,
      name: "Martine van der Voort",
      description: "Zakelijke portretten, redactionele fotografie en teamfoto's",
      website: "martinevandervoort.nl"
    },
    {
      id: 4,
      name: "Jan Pieter Keller",
      description: "Zakelijke portretfotograaf in Amsterdam-Oost",
      website: "janpieterkeller.com"
    },
    {
      id: 5,
      name: "Fotoshoot.nl",
      description: "Professionele portret en familie fotoshoots in studio of op locatie",
      website: "fotoshoot.nl"
    },
    {
      id: 6,
      name: "Carin Verbruggen",
      description: "Zakelijke portretfoto's, teamfoto's en kantoorruimte fotografie",
      website: "carinverbruggen.com"
    },
    {
      id: 7,
      name: "Let's Face It",
      description: "Portretfotografie voor bedrijven, website en LinkedIn",
      website: "letsfaceit.photo"
    },
    {
      id: 8,
      name: "Cindy Jeurissen",
      description: "Professionele zakelijke fotografie die bedrijven perfect in beeld brengt",
      website: "cindyjeurissen.nl"
    },
    {
      id: 9,
      name: "Evelien Hogers",
      description: "Zakelijke fotografie voor ondernemers, ZZP'ers en bedrijven",
      website: "evelienhogers.com"
    },
    {
      id: 10,
      name: "Stefan Segers Fotografie",
      description: "Event-, bedrijfs- en portretfotografie in Amsterdam",
      website: "stefansegers.nl"
    },
    {
      id: 11,
      name: "Len Land Photography",
      description: "Zakelijke portretten voor LinkedIn-profiel, website of CV",
      website: "lenlandphotography.com"
    },
    {
      id: 12,
      name: "Rudenko Photography",
      description: "Ervaren bedrijfsfotograaf met professionele bedrijfsfotografie",
      website: "rudenko-photography.com"
    },
    {
      id: 13,
      name: "Bedrijfsfotografie.nl",
      description: "Professionele bedrijfsfotografie door Rogier Chang",
      website: "bedrijfsfotografie.nl"
    },
    {
      id: 14,
      name: "Zakelijke Fotograaf",
      description: "Editorial fotografie voor zakelijke portretten",
      website: "zakelijkefotograaf.nl"
    },
    {
      id: 15,
      name: "Mark Nederhoed Fotografie",
      description: "Zakelijke fotografie, bedrijfsreportages en portretten",
      website: "marknederhoedfotografie.nl"
    },
    {
      id: 16,
      name: "Katja Mali Fotografie",
      description: "15 jaar ervaring in professionele portretfotografie",
      website: "katjamali.nl"
    },
    {
      id: 17,
      name: "Joppe Fotografie",
      description: "Zakelijke portretfotografie, reportages en evenementenfotografie",
      website: "joppefotografie.nl"
    },
    {
      id: 18,
      name: "RG Fotografie",
      description: "Professioneel fotograaf voor zakelijke en evenementen fotografie",
      website: "rg-fotografie.nl"
    },
    {
      id: 19,
      name: "Limelight Today",
      description: "Bedrijfsfotografie, zakelijke portretten en sfeerimpressies",
      website: "limelight-today.com"
    },
    {
      id: 20,
      name: "Anouk Strijbos Fotografie",
      description: "Zakelijke fotografie met persoonlijke en unieke aanpak",
      website: "anoukstrijbos.nl"
    },
    {
      id: 21,
      name: "Victoria Ushkanova",
      description: "Award Winning portret-, documentaire- en fashionfotograaf",
      website: "victoriaushkanova.com"
    },
    {
      id: 22,
      name: "Joep van Drunen Photography",
      description: "Portret-, zakelijke fotografie en bruidsreportages",
      website: "joepvandrunen.nl"
    },
    {
      id: 23,
      name: "BR Fotografie",
      description: "Personal branding en zakelijke fotografie voor ondernemers",
      website: "br-fotografie.nl"
    },
    {
      id: 24,
      name: "Portretfotograaf Amsterdam",
      description: "Professionele portretfotografie voor zakelijk profiel en website",
      website: "portretfotograafamsterdam.nl"
    },
    {
      id: 25,
      name: "Meekspictures",
      description: "Professionele fotograaf Nienke Meek met uitgebreid portfolio",
      website: "meekspictures.nl"
    },
    {
      id: 26,
      name: "ProFotostudio Amsterdam",
      description: "Portretfotografie en zakelijke fotoshoots met hoge kwaliteit",
      website: "profotostudio.nl"
    },
    {
      id: 27,
      name: "Melanie Lemahieu Photography",
      description: "Zakelijke portretfotografie binnen of buiten op de werkplek",
      website: "melanielemahieu.com"
    },
    {
      id: 28,
      name: "Foto-N-Go",
      description: "Professionele fotoshoot in studio van 40 minuten",
      website: "foto-n-go.com"
    },
    {
      id: 29,
      name: "Joyce Goverde",
      description: "Ervaren zakelijk fotograaf regio Amsterdam en Haarlem",
      website: "joycegoverde.com"
    },
    {
      id: 30,
      name: "Xammes Fotografie",
      description: "Zakelijk portretfotografie Zuidas en omgeving Haarlem-Amsterdam",
      website: "xammes.nl"
    },
    {
      id: 31,
      name: "Fotografen.nl",
      description: "Platform met gespecialiseerde fotografen waaronder portret en zakelijke fotografie",
      website: "fotografen.nl"
    },
    {
      id: 32,
      name: "Headshot Day",
      description: "Mobiele fotostudio voor professionele teamportretten op de werkvloer",
      website: "headshotday.nl"
    },
    {
      id: 33,
      name: "Abel Ponger Fotografie",
      description: "Zakelijke portretten op locatie met mobiele studio in heel Nederland",
      website: "fotograaf.amsterdam"
    },
    {
      id: 34,
      name: "Richard Event Fotografie",
      description: "Freelance professionele portretfotografie en zakelijke portretten",
      website: "richardeventfotografie.nl"
    },
    {
      id: 35,
      name: "Photoyou - Magdalena Heijting",
      description: "20 jaar ervaring in portretfotografie en zakelijke fotografie",
      website: "photoyou.nl"
    },
    {
      id: 36,
      name: "Studio 7N",
      description: "Headshots en bedrijfsfotografie in Amsterdam Center East",
      website: "studio7n.nl"
    },
    {
      id: 37,
      name: "Leonardo Graterol",
      description: "Commerciële fotografie en vastgoedfotografie in Amsterdam en omgeving",
      website: "leonardograterol.com"
    },
    {
      id: 38,
      name: "Bmoments",
      description: "Zakelijke portretfoto's, natuurlijk en professioneel bewerkt",
      website: "bmoments.nl"
    }
  ],
  rotterdam: [
    {
      id: 21,
      name: "Fotoshoot.nl",
      description: "Ervaren fotografen gespecialiseerd in portret, familie en bedrijfsfotografie",
      website: "fotoshoot.nl"
    },
    {
      id: 22,
      name: "Suzan Alberts Photography",
      description: "Professionele zakelijke fotografie en bedrijfsfotografie met sterke portretten",
      website: "suzanalberts.com"
    },
    {
      id: 23,
      name: "Rotterdam Fotostudio",
      description: "Ruime fotostudio van 200m² voor professionele fotoshoots en portretfotografie",
      website: "rotterdamfotostudio.com"
    },
    {
      id: 24,
      name: "Zakelijke Portretten",
      description: "Professionele zakelijke portretfotografie voor sterke eerste indruk",
      website: "zakelijke-portretten.nl"
    },
    {
      id: 25,
      name: "Jasper Hof",
      description: "7+ jaar ervaring in professionele fotografie regio Rijnmond",
      website: "jasperhof.nl"
    },
    {
      id: 26,
      name: "Rommen | Bravenboer Fotografie",
      description: "Professionele fotoshoots inclusief visagie en hairstyling",
      website: "rommenphotography.com"
    },
    {
      id: 27,
      name: "Rogier Bos",
      description: "Zakelijke en bedrijfsfotografie met focus op industriële fotografie",
      website: "rogierbos.com"
    },
    {
      id: 28,
      name: "Fotoshoot Rotterdam",
      description: "Persoonlijke aandacht en professionele beelden voor privé en zakelijk",
      website: "fotoshoot-rotterdam.com"
    },
    {
      id: 29,
      name: "Spaay Fotografie",
      description: "Bedrijfsfotografie, pasfoto's en portretfoto's nabij Rotterdam",
      website: "spaay-fotografie.com"
    },
    {
      id: 30,
      name: "Carola Paas Fotografie",
      description: "Bedrijfsfotografie en personal branding fotograaf uit Rotterdam",
      website: "carolapaas.nl"
    },
    {
      id: 31,
      name: "Huib Nederhof",
      description: "Zakelijke fotograaf Rotterdam voor bedrijfsfotografie en groepsfoto's",
      website: "huibnederhof.nl"
    },
    {
      id: 32,
      name: "Bedrijfsfotografie.nl Rotterdam",
      description: "Professionele zakelijke fotografie voor bedrijven in Rotterdam",
      website: "bedrijfsfotografie.nl"
    },
    {
      id: 33,
      name: "Stefan Segers Fotografie",
      description: "Event-, bedrijfs- en portretfotografie op locatie of in studio",
      website: "stefansegers.nl"
    },
    {
      id: 34,
      name: "Heisa Fotografie",
      description: "Ruime ervaring, werkt voor RET, Gemeente Rotterdam en Rijkswaterstaat",
      website: "heisa.nl"
    },
    {
      id: 35,
      name: "Photoyou Rotterdam",
      description: "Zakelijke fotografie en bedrijfsreportages met veel ervaring",
      website: "photoyou.nl"
    },
    {
      id: 36,
      name: "DV Fotografie",
      description: "Fotoshoot in studio Rotterdam of op locatie met mobiele fotostudio",
      website: "dv-fotografie.nl"
    },
    {
      id: 37,
      name: "Studio Annemarije",
      description: "Personal branding fotograaf voor ondernemers, website en social media",
      website: "studioannemarije.nl"
    },
    {
      id: 38,
      name: "Studio Hoge Heren",
      description: "Fotostudio voor familiefotografie, pasfoto's en zakelijke portretten",
      website: "studiohogeheren.nl"
    },
    {
      id: 39,
      name: "Emiel Lops",
      description: "Zakelijke fotograaf voor portretten, sfeerbeelden en bedrijfsreportages",
      website: "emiellops.nl"
    },
    {
      id: 40,
      name: "Tom Tomeij Fotografie",
      description: "Bekroond fotograaf en filmmaker voor hoogwaardige zakelijke fotografie",
      website: "tomtomeij.nl"
    },
    {
      id: 41,
      name: "Grow by Visuals",
      description: "Fotostudio in Rotterdam West voor zakelijke en portretfotografie",
      website: "growbyvisuals.com"
    },
    {
      id: 42,
      name: "Danitsja Larissa Fotografie",
      description: "Professionele fotograaf Rotterdam met jarenlange ervaring",
      website: "danitsjalarissafotografie.nl"
    },
    {
      id: 43,
      name: "Rick van der Poorten Fotografie",
      description: "Zakelijke portretfotografie voor LinkedIn en bedrijfspresentaties",
      website: "rickvanderpoorten.com"
    },
    {
      id: 44,
      name: "Annelien Nijland Fotografie",
      description: "Spontane portret en reportage fotografie met filmische sfeer",
      website: "anneliennijland.nl"
    },
    {
      id: 45,
      name: "EYE-FOCUS Fotografie",
      description: "Bedrijfsfotografie Rotterdam voor portretten en industriefotografie",
      website: "huibnederhof.nl"
    },
    {
      id: 46,
      name: "De Rooij Fotografie",
      description: "Trainingscentrum voor fotografie met 5000+ cursisten jaarlijks",
      website: "derooijfotografie.nl"
    },
    {
      id: 47,
      name: "Marijnissen Fotografie",
      description: "De nummer 1 fotostudio van Rotterdam voor zakelijke portretten",
      website: "marijnissenfotografie.nl"
    },
    {
      id: 48,
      name: "Reclamebeeld.nl",
      description: "Zakelijke portretfotografie op locatie door beroepsfotograaf Wilmar",
      website: "reclamebeeld.nl"
    },
    {
      id: 49,
      name: "Weers Photography",
      description: "Portret fotoshoots in Rotterdam en Zuid-Holland",
      website: "weers.photo"
    }
  ],
  "den-haag": [
    {
      id: 91,
      name: "Frank van der Burg",
      description: "Professionele fotograaf met oog voor detail en creatieve bedrijfsfotografie",
      website: "frankvanderburg.nl"
    },
    {
      id: 92,
      name: "Fotoshoot.nl Den Haag",
      description: "Commerciële fotografie en professionele fotoshoots voor bedrijven",
      website: "fotoshoot.nl"
    },
    {
      id: 93,
      name: "Gerrit Vermeulen Fotografie",
      description: "Bouw foto's, video's en bouwkundige media voor bouwbedrijven",
      website: "gerritvermeulen.nl"
    },
    {
      id: 94,
      name: "Studio Oostrum",
      description: "Professionele bedrijfsfotografie, film en animatie vanuit Den Haag",
      website: "studiooostrum.nl"
    },
    {
      id: 95,
      name: "De Beeldstudio",
      description: "Bedrijfsfotografie en videografie met verhaal, bedrijfsreportages",
      website: "debeeldstudio.nl"
    },
    {
      id: 96,
      name: "Reclamebeeld.nl",
      description: "Bedrijfsfilms en bedrijfsfotografie, zakelijke portretfotografie",
      website: "reclamebeeld.nl"
    },
    {
      id: 97,
      name: "Portretfotograaf Den Haag",
      description: "Portretten voor bedrijven en particulieren op locatie of in studio",
      website: "portretfotograafdenhaag.nl"
    },
    {
      id: 98,
      name: "Het Beeldatelier",
      description: "Food-, horeca- en merkfotografie, commercieel en authentiek beeld",
      website: "hetbeeldatelier.nl"
    },
    {
      id: 99,
      name: "Bart van Hattem",
      description: "Professionele headshot- en portretfotograaf voor LinkedIn en branding",
      website: "zakelijke-portretfoto.nl"
    },
    {
      id: 100,
      name: "Irene van Kessel",
      description: "Zakelijke fotografie van events, meetings en trainingen",
      website: "irenevankessel.nl"
    },
    {
      id: 101,
      name: "Photoworkx",
      description: "Portretfotografie en 360° Google Business View",
      website: "photoworkx.nl"
    },
    {
      id: 102,
      name: "Bedrijfsfotografie.nl Den Haag",
      description: "Professionele bedrijfsfotografie door Rogier Chang",
      website: "bedrijfsfotografie.nl"
    },
    {
      id: 103,
      name: "Sjoerd van der Hucht Fotografie",
      description: "Profielfoto's, portretten, bedrijfsfotografie met eigen fotostudio",
      website: "sjoerdvanderhucht.com"
    },
    {
      id: 104,
      name: "Stefan Segers Fotografie",
      description: "Event-, bedrijfs- en portretfotografie op locatie of in studio",
      website: "stefansegers.nl"
    },
    {
      id: 105,
      name: "Charlotte van Wooning",
      description: "Zakelijke portretfoto's en fotoreportages",
      website: "charlottevanwooning.nl"
    },
    {
      id: 106,
      name: "Limestone Pictures",
      description: "Filmmaker en fotograaf Willem Martinot sfeervolle zakelijke portretten",
      website: "limestonepictures.nl"
    },
    {
      id: 107,
      name: "Studio Dijkgraaf",
      description: "Bedrijfsfotograaf Den Haag op locatie of eigen studio",
      website: "studiodijkgraaf.nl"
    },
    {
      id: 108,
      name: "Upstream Marketing",
      description: "Professionele fotograaf in Den Haag met creativiteit en kwaliteit",
      website: "upstreammarketing.nl"
    },
    {
      id: 109,
      name: "Fotografie Den Haag",
      description: "Professionele fotograaf met 20+ jaar ervaring in zakelijke fotografie",
      website: "fotografiedenhaag.nl"
    },
    {
      id: 110,
      name: "Forever Images - Michiel Borgart",
      description: "Fotostudio in Den Haag voor fotoshoots op locatie",
      website: "foreverimages.nl"
    },
    {
      id: 111,
      name: "Emiel Lops Photography",
      description: "Bedrijfsfotograaf gespecialiseerd in bedrijfs- en portretfotografie",
      website: "emiellops.nl"
    },
    {
      id: 112,
      name: "Yvette Wolterinck Profielfotograaf",
      description: "Imago- en bedrijfsfotograaf versterkt identiteit met krachtig beeld",
      website: "profielfotograaf.com"
    },
    {
      id: 113,
      name: "Jasper Hof",
      description: "Professionele fotograaf 2025 - 9+ jaar ervaring",
      website: "jasperhof.nl"
    },
    {
      id: 114,
      name: "Rishi's Photography",
      description: "Freelance fotograaf breed scala aan fotografiediensten",
      website: "rishiphotography.nl"
    },
    {
      id: 115,
      name: "Willem Martinot",
      description: "Bedrijfsfotografie op locatie professionele meerwaarde",
      website: "willemmartinot.nl"
    },
    {
      id: 116,
      name: "Michel Mees",
      description: "Bedrijfsfotografie, zakelijke portret, reportage, congresfotografie",
      website: "michelmees.nl"
    },
    {
      id: 117,
      name: "Mensen.photo",
      description: "Zakelijk portret fotograaf voor vele bedrijven",
      website: "mensen.photo"
    },
    {
      id: 118,
      name: "Xammes Fotografie",
      description: "Zakelijk portret fotoshoot professionele eerste indruk",
      website: "xammes.nl"
    },
    {
      id: 119,
      name: "Robert van Hall Fotografie",
      description: "Zakelijke portretfotografie met moodboard fotostudio",
      website: "robertvanhall.nl"
    },
    {
      id: 120,
      name: "Wilmar Dik - Fotograaf Den Haag",
      description: "Bedrijfsfotograaf en cameraman 15+ jaar ervaring",
      website: "reclamebeeld.nl"
    }
  ],
  utrecht: [
    {
      id: 41,
      name: "LINK Fotografie",
      description: "Professionele bedrijfsfotografie en portretfotografie in Utrecht",
      website: "linkfotografie.nl"
    },
    {
      id: 42,
      name: "Martine van der Voort",
      description: "Bedrijfsfotograaf voor zakelijke portretten en personal branding",
      website: "martinevandervoort.nl"
    },
    {
      id: 43,
      name: "Norbert Waalboer Fotografie",
      description: "Professionele portretfoto's met mobiele fotostudio",
      website: "debestefotograaf.nl"
    },
    {
      id: 44,
      name: "Elisa Smook Fotografie",
      description: "Creatieve fotograaf en content creator uit Utrecht",
      website: "elisasmook.com"
    },
    {
      id: 45,
      name: "Moniek van Selm Fotografie",
      description: "Bedrijfsfotografie, brandingsfotoshoot en zakelijke portretten",
      website: "moniekvanselmfotografie.nl"
    },
    {
      id: 46,
      name: "Marcel Schenk Photography",
      description: "Professionele profielfoto's en creatieve portretten",
      website: "marcelschenk.nl"
    },
    {
      id: 47,
      name: "David Lok",
      description: "Professionele zakelijke portretfoto's tegen voordelig tarief",
      website: "davidlok.nl"
    },
    {
      id: 48,
      name: "Aagjestudio",
      description: "Veelzijdige fotograaf voor zakelijke portretten tot bruiloften",
      website: "aagjestudio.nl"
    },
    {
      id: 49,
      name: "Arma Fotografie",
      description: "Zakelijke fotografie, beeldbank fotografie en storytelling",
      website: "armafotografie.nl"
    },
    {
      id: 50,
      name: "Joni Israeli",
      description: "Bedrijfsfotograaf voor heldere en levendige foto's",
      website: "joniisraeli.com"
    },
    {
      id: 51,
      name: "Klikklak.nu",
      description: "Portretfotograaf Utrecht voor ontspannen portretfoto's en brandingfoto's",
      website: "klikklak.nu"
    },
    {
      id: 52,
      name: "Stefan Segers Fotografie Utrecht",
      description: "Event-, bedrijfs- en portretfotografie op locatie of in studio",
      website: "stefansegers.nl"
    },
    {
      id: 53,
      name: "Fotoshoot.nl Utrecht",
      description: "Professionele fotografie ervaring portret en bedrijfsshoots",
      website: "fotoshoot.nl"
    },
    {
      id: 54,
      name: "Voorbeeld Fotografie",
      description: "Bruids-, zakelijke- en gezinsfotografie in Utrecht en omgeving",
      website: "voorbeeldfotografie.nl"
    },
    {
      id: 55,
      name: "Fotostudio XL",
      description: "Professionele fotograaf Utrecht zakelijke fotografie",
      website: "fotostudioxl.nl"
    },
    {
      id: 56,
      name: "Anouk Vermeulen Fotografie",
      description: "Professionele zakelijke fotografie Nederland",
      website: "anoukvermeulenfotografie.nl"
    },
    {
      id: 57,
      name: "Jan Pieter Keller Utrecht",
      description: "Zakelijke fotoshoot sterke zakelijke fotografie",
      website: "janpieterkeller.com"
    },
    {
      id: 58,
      name: "Echt Mooij Fotografie",
      description: "Professionele zakelijke fotografie Utrecht en op locatie",
      website: "echtmooij.nl"
    },
    {
      id: 59,
      name: "Heleen Klop Fotografen",
      description: "Fotograaf Utrecht bruiloft, families en zakelijke momenten",
      website: "heleenklop.nl"
    },
    {
      id: 60,
      name: "Ruud Voest",
      description: "Fotograaf Utrecht bedrijfsfotografie, portret en profielfoto",
      website: "ruudvoest.nl"
    },
    {
      id: 61,
      name: "KL!K Zakelijke Fotografie",
      description: "Mooie foto's voor website, sociale media en flyers",
      website: "klik-fotos.nl"
    },
    {
      id: 62,
      name: "Corrine P. Fotografie",
      description: "Zakelijke fotografie Utrecht creatief en professioneel",
      website: "corrinep.nl"
    },
    {
      id: 63,
      name: "Birense Fotografie",
      description: "Professionele branding fotoshoot en zakelijke portretten",
      website: "birensefotografie.nl"
    },
    {
      id: 64,
      name: "Beeldboot",
      description: "Zakelijke fotografie Utrecht studio portret beeldbank",
      website: "beeldboot.nl"
    },
    {
      id: 65,
      name: "Ploko.nl",
      description: "Professionele bedrijfsfotografie in Utrecht",
      website: "ploko.nl"
    },
    {
      id: 66,
      name: "Peter Roelofs Photography",
      description: "Professionele portretten fotostudio Utrecht zakelijke profielfoto's",
      website: "peterroelofs.eu"
    },
    {
      id: 67,
      name: "MoMo Fotografie",
      description: "Zakelijke fotoshoot voor verschillende doelgroepen",
      website: "momofotografie.nl"
    },
    {
      id: 68,
      name: "Hennuin Fotografie",
      description: "Allround fotograaf portretten profielfoto's reportages",
      website: "hennuinfotografie.nl"
    },
    {
      id: 69,
      name: "Social Media Profielfoto",
      description: "Fotoshoot Utrecht zakelijke profielfoto coaching en advies",
      website: "socialmediaprofielfoto.nl"
    },
    {
      id: 70,
      name: "IDM Fotografie",
      description: "Personal branding fotoshoot Utrecht zakelijke business fotografie",
      website: "idmfotografie.com"
    },
    {
      id: 71,
      name: "Carina Calis Fotografie",
      description: "Portretfotografie profielfoto zakelijke portretfoto's",
      website: "carinacalis.nl"
    },
    {
      id: 72,
      name: "Brenda Roos Fotografie",
      description: "Portret en branding fotograaf Utrecht en omgeving",
      website: "brendaroos.nl"
    },
    {
      id: 73,
      name: "Marcel Schenk Photography Utrecht",
      description: "Fotoshoot Utrecht mooie en authentieke foto's",
      website: "marcelschenk.nl"
    },
    {
      id: 74,
      name: "Wendy van Bree Fotografie",
      description: "Zakelijke portretfoto Utrecht portretreportages op maat",
      website: "wendyvanbree-fotografie.nl"
    },
    {
      id: 75,
      name: "Zakelijke Foto Missies",
      description: "Brandingshoot bedrijfsfotograaf creatieve bedrijfsfotografie",
      website: "zakelijkefotomissies.nl"
    },
    {
      id: 76,
      name: "BFoto.nl",
      description: "Fotograaf Utrecht portret evenement en bedrijfsfoto's originele foto's",
      website: "bfoto.nl"
    }
  ],
  eindhoven: [
    {
      id: 61,
      name: "Annemarie van Vugt Fotografie",
      description: "Zakelijke fotografie voor professionele eerste indruk",
      website: "annemarievanvugt.nl"
    },
    {
      id: 62,
      name: "Eline den Hond Fotografie",
      description: "Zakelijke en brandingfotografie in Eindhoven en omgeving",
      website: "elinedenhond.nl"
    },
    {
      id: 63,
      name: "Woetah",
      description: "Bedrijfsfotografie en fotoshoots in Eindhoven",
      website: "woetah.nl"
    },
    {
      id: 64,
      name: "Wanderbrooks",
      description: "Professioneel fotograaf studio en op locatie met natuurlijk licht",
      website: "wanderbrooks.nl"
    },
    {
      id: 65,
      name: "Epsilon Studios",
      description: "Foto en video studio voor bedrijfsfotografie en zakelijke fotografie",
      website: "epsilonstudios.nl"
    },
    {
      id: 66,
      name: "Michael Graste Fotografie",
      description: "Bedrijfsfotografie Helmond Eindhoven en Randstad",
      website: "michaelgraste.com"
    },
    {
      id: 67,
      name: "Marijke Krekels Fotografie",
      description: "Zakelijke portretten en bedrijfsfotografie",
      website: "marijkekrekels.nl"
    },
    {
      id: 68,
      name: "Inge van Beekum Fotografie",
      description: "Bedrijfsfotografie en zakelijke profielfoto's",
      website: "ingevanbeekum.nl"
    },
    {
      id: 69,
      name: "Frans Claassen Fotografie",
      description: "Zakelijke portretten in mobiele studio of eigen studio",
      website: "fransclaassenfotografie.nl"
    },
    {
      id: 70,
      name: "Joppe Fotografie",
      description: "Zakelijke portretfotografie en bedrijfsfotografie regio Eindhoven",
      website: "joppefotografie.nl"
    },
    {
      id: 71,
      name: "Bart van Vlijmen Fotografie",
      description: "Flexibele diensten van teamfoto's tot productfotografie en zakelijke portretten",
      website: "bartvanvlijmen.nl"
    },
    {
      id: 72,
      name: "Perfectief-Fotografie",
      description: "Zakelijke fotografie Helmond/Eindhoven",
      website: "perfectief-fotografie.nl"
    },
    {
      id: 73,
      name: "Beeldbaas",
      description: "Commerciële fotografie en video in Eindhoven",
      website: "beeldbaas.nl"
    },
    {
      id: 74,
      name: "11A Fotografie",
      description: "Zakelijke portretfotografie en branding fotoshoots",
      website: "11afotografie.nl"
    },
    {
      id: 75,
      name: "Kim Vulders Fotografie",
      description: "Bedrijfsfotografie regio Eindhoven",
      website: "kimvuldersfotografie.nl"
    },
    {
      id: 76,
      name: "Niels van Tongerloo",
      description: "Bedrijfsfotograaf met drone voor Eindhoven Weert",
      website: "nielsvantongerloo.com"
    },
    {
      id: 77,
      name: "Ivo Verschuuren - EYE Fotografie",
      description: "Professionele bedrijfsfotografie voor ondernemingen",
      website: "eye-fotografie.nl"
    },
    {
      id: 78,
      name: "Jordy Leenders",
      description: "Bedrijfsfotografie en sportfotografie",
      website: "jordyleenders.com"
    },
    {
      id: 79,
      name: "Dobrusskin Photography",
      description: "Zakelijke en personal branding fotografie",
      website: "dobrusskinphoto.nl"
    },
    {
      id: 80,
      name: "DVE Photography",
      description: "Studio product bedrijf en portret fotografie",
      website: "dve-photography.com"
    },
    {
      id: 81,
      name: "Ria van der Ploeg Fotografie",
      description: "Professionele bedrijfsfotograaf Eindhoven",
      website: "riavanderploegfotografie.nl"
    },
    {
      id: 82,
      name: "Zachte Pixel",
      description: "Personal branding fotografie voor ondernemers in Eindhoven",
      website: "zachtepixel.nl"
    },
    {
      id: 83,
      name: "Fred de Krom Fotografie",
      description: "Bedrijfsreportages en productfotografie",
      website: "freddekromfotografie.nl"
    },
    {
      id: 84,
      name: "Sharon Willems",
      description: "Bedrijfsfotograaf Eindhoven voor websites",
      website: "sharonwillems.nl"
    },
    {
      id: 85,
      name: "Studio Ten Tusscher",
      description: "Foodfotografie, bedrijfsfotografie en eventfotografie",
      website: "studiotentusscher.nl"
    },
    {
      id: 86,
      name: "JOOSJE Fotografie - JNSSN",
      description: "Personal branding fotografie",
      website: "jnssnfotografie.nl"
    },
    {
      id: 87,
      name: "Fotografie Aniek",
      description: "Zakelijke portretten en profielfoto's",
      website: "fotografieaniek.nl"
    },
    {
      id: 88,
      name: "Siscoow Pictures",
      description: "Fotografie en videografie producties",
      website: "siscoow-pictures.nl"
    },
    {
      id: 89,
      name: "DeFotomeneer",
      description: "Commerciële fotografie en videografie Eindhoven",
      website: "defotomeneer.nl"
    },
    {
      id: 90,
      name: "Denise Branding Fotografie",
      description: "Personal branding fotografie voor ondernemers",
      website: "denisebrandingfotografie.nl"
    }
  ],
  tilburg: [
    {
      id: 71,
      name: "Frans Lahaye Fotografie",
      description: "Beste fotograaf bedrijfsfotografie portretfotografie reclamefotografie Tilburg",
      website: "franslahayefotografie.nl"
    },
    {
      id: 72,
      name: "Bianca van der Veen Portraiture",
      description: "Luxe fotostudio Tilburg magazine style portretten high-end warme eigentijdse klassieke",
      website: "biancavanderveen.com"
    },
    {
      id: 73,
      name: "Joppe Fotografie Tilburg",
      description: "Bedrijfsfotografie regio Tilburg zakelijke portretfotografie",
      website: "joppefotografie.nl"
    },
    {
      id: 74,
      name: "Bart van Hattem",
      description: "Professionele headshot portretfotograaf specialist zakelijke portret illustratieve fotografie",
      website: "zakelijke-portretfoto.nl"
    },
    {
      id: 75,
      name: "Pixivo Photography & Video",
      description: "Professionele fotograaf zakelijke shoots sfeervolle beelden verhaal vertellen",
      website: "pixivo.nl"
    },
    {
      id: 76,
      name: "Ymke Frijters Fotografie",
      description: "Bedrijfsfotografie Brabant uniek jezelf laten zien uitnodigende professionele unieke beelden",
      website: "ymkefrijters.nl"
    },
    {
      id: 77,
      name: "Beeldfirma",
      description: "Bedrijfsreportage zakelijke fotografie productieproces sfeerfoto's bedrijf professioneel",
      website: "beeldfirma.nl"
    },
    {
      id: 78,
      name: "Eva van Oers Fotografie",
      description: "Bedrijfsfotografie Tilburg portretten medewerkers dagelijkse werkzaamheden sfeervolle bedrijfsruimte",
      website: "evavanoersfotografie.nl"
    },
    {
      id: 79,
      name: "Bart van Vlijmen Fotografie",
      description: "Zakelijke portretfoto Tilburg krachtige profielfoto's medewerkers directie raad bestuur",
      website: "bartvanvlijmen.nl"
    },
    {
      id: 80,
      name: "Sander Verhoeven",
      description: "Zakelijke fotografie impact portretten sfeerbeelden evenementfotografie",
      website: "sanderverhoeven.com"
    },
    {
      id: 81,
      name: "Studio Verus",
      description: "Fotografie film Tilburg Hell Yeah Vera Bouwhuis professionele foto videograaf",
      website: "studioverus.nl"
    },
    {
      id: 82,
      name: "11A Fotografie",
      description: "Zakelijk portret fotograaf Tilburg Joyce Schieven fotograaf van de liefde",
      website: "11afotografie.nl"
    },
    {
      id: 83,
      name: "BEIJ.VON Photography",
      description: "Fotografie verhuur daglichtstudio business support passie ondernemen dromen puur gedreven",
      website: "beijvon.nl"
    },
    {
      id: 84,
      name: "Marcel van den Broek Fotografie",
      description: "Optimale kwaliteit trouwreportage vastgoedfotografie zakelijke fotografie",
      website: "mvdbf.nl"
    },
    {
      id: 85,
      name: "LotRijk Producties",
      description: "Fotograaf fotoshoot Tilburg beste oplossingen zakelijke particuliere vragen",
      website: "lotrijk.nl"
    },
    {
      id: 86,
      name: "Marijke Krekels Fotografie",
      description: "Zakelijk portret fotografie LinkedIn CV website sollicitatie",
      website: "marijkekrekels.nl"
    },
    {
      id: 87,
      name: "Bas Haans Fotografie",
      description: "Merk visuele boost professionele zakelijke fotografie sociale media verhaal merkwaarden",
      website: "bashaans.nl"
    },
    {
      id: 88,
      name: "Van Boxtel Fotografie",
      description: "Persoonlijke allround fotograaf diverse fotografie film diensten klik vol emotie",
      website: "vanboxtelfotografie.com"
    },
    {
      id: 89,
      name: "Frans van Aarle",
      description: "Fotografie 75 jaar DE fotograaf regio Tilburg alles op gebied fotografie",
      website: "fransvanaarle.nl"
    },
    {
      id: 90,
      name: "Patricia Mallens Fotografie",
      description: "Fotostudio Brabantse Rijen familie trouw portretfoto's irisfotografie",
      website: "patriciamallensfotografie.nl"
    },
    {
      id: 91,
      name: "P-Focused",
      description: "LinkedIn fotograaf Tilburg perfecte profielfoto's eigen studio CV",
      website: "p-focused.nl"
    },
    {
      id: 92,
      name: "Fotostudio Eye 4 You",
      description: "Professionele foto's fotokunst persoonlijk vertrouwelijk meedenken",
      website: "trustoo.nl"
    },
    {
      id: 93,
      name: "Sharon Stads Fotografie",
      description: "Zakelijke markt bedrijven events beeldbank branding shoots kleine ondernemers",
      website: "sharonstads.nl"
    },
    {
      id: 94,
      name: "Onemotion Tilburg",
      description: "Professionele fotoshoot vanaf €25 vrijgezellenfeest regio Waalwijk Goirle",
      website: "onemotion.nl"
    },
    {
      id: 95,
      name: "Danielle van den Tillaard Fotografie",
      description: "Fotografie professionele nabewerking digitale HR fotobestanden fotogalerij mooi album",
      website: "daniellevandentillaard.nl"
    },
    {
      id: 96,
      name: "Fotostudio Fabro",
      description: "Nieuwe studio Bergstraat Goirle geschikt fotografie 10 personen zakelijke",
      website: "fotostudiofabro.nl"
    },
    {
      id: 97,
      name: "Evelien IJpelaar Fotografie",
      description: "Fotograaf Tilburg Waalwijk zakelijke fotoshoot professionele foto's bedrijf",
      website: "evelienijpelaar.nl"
    },
    {
      id: 98,
      name: "Bijzondere Bedrijfsportretten",
      description: "Zakelijke portretfotograaf ondernemers professional Nijmegen Tilburg Den Bosch Utrecht",
      website: "bijzonderebedrijfsportretten.nl"
    },
    {
      id: 99,
      name: "Jostijn Ligtvoet Fotografie",
      description: "Portretten fotografie 3voor12 tilburg fototechnisch uitproberen",
      website: "jostijnligtvoet.nl"
    },
    {
      id: 100,
      name: "Studio Poses",
      description: "Officiële pasfoto's RDW erkend profielfoto Raad Tilburg professionele fotograaf",
      website: "studioposes.nl"
    },
    {
      id: 101,
      name: "De Rooij Fotografie Tilburg",
      description: "Fotografie cursus workshop basiscursus professionele fotograaf praktijkervaring",
      website: "derooijfotografie.nl"
    },
    {
      id: 102,
      name: "SMD Photography",
      description: "Schoonheid gevangen fotografie ontspannen sfeer professionele begeleiding",
      website: "smd-photography.com"
    },
    {
      id: 103,
      name: "Jeroen de Beer Fotografie",
      description: "Nederlandse bodybuilding fitness fotograaf Tilburg eigen studio 270 m2",
      website: "jeroendebeerfotografie.nl"
    },
    {
      id: 104,
      name: "Lot Fotografie",
      description: "All eyes on you professionele foto's uitstralen wie je bent website socials",
      website: "lotfotografie.nl"
    }
  ],
  groningen: [
    {
      id: 81,
      name: "Fotoshoot.nl Groningen",
      description: "Bedrijfsfotografie, portretfotoshoots en familiereportages",
      website: "fotoshoot.nl"
    },
    {
      id: 82,
      name: "Diepzeekonijn",
      description: "Productfotografie, fashion shoots, zakelijke portretten en evenementenfotografie",
      website: "diepzeekonijn.nl"
    },
    {
      id: 83,
      name: "Leonie Kuizenga Fotografie",
      description: "Fotografie op locatie voor ondernemingen en ondernemers",
      website: "leoniekuizenga.nl"
    },
    {
      id: 84,
      name: "KVfoto",
      description: "Zakelijke fotoshoot voor creatieve ondernemers",
      website: "kvfoto.nl"
    },
    {
      id: 85,
      name: "Alwin Van Wijngaarden",
      description: "Professionele zakelijke fotografie die net iets anders zijn",
      website: "alwinvanwijngaarden.com"
    },
    {
      id: 86,
      name: "Ronald Zijlstra",
      description: "Frisse zakelijke portretten toegankelijk in beeld",
      website: "ronaldzijlstra.nl"
    },
    {
      id: 87,
      name: "Nienes Moodlab",
      description: "Zakelijke profielfoto en professioneel portret",
      website: "nienesmoodlab.nl"
    },
    {
      id: 88,
      name: "Studio Flink",
      description: "Bedrijfsfotografie Groningen naast video's",
      website: "studioflink.nl"
    },
    {
      id: 89,
      name: "Roos van der Wiel Fotografie",
      description: "Zakelijke fotoshoot foto's van jezelf en je bedrijf",
      website: "roosvanderwiel.nl"
    },
    {
      id: 90,
      name: "Nanda Stam Fotografie",
      description: "Fotoreportage op locatie dagelijkse werkzaamheden en sfeer organisatie",
      website: "nandastam.nl"
    },
    {
      id: 91,
      name: "Jan Buwalda",
      description: "Fotostudio bedrijfsfotografie interieurfotografie productfotografie en portretten",
      website: "janbuwalda.nl"
    },
    {
      id: 92,
      name: "Bedrijfsfotografie Groningen - Lobke Vale",
      description: "Spontane enthousiaste fotograaf persoonlijke benadering",
      website: "bedrijfsfotografiegroningen.nl"
    },
    {
      id: 93,
      name: "Kleij en Co",
      description: "Bedrijfsfotograaf zakelijke foto's website social media personal branding",
      website: "kleijenco.nl"
    },
    {
      id: 94,
      name: "Esmee Bartelink Fotografie",
      description: "Brandshoot zakelijke fotografie passie drive achter bedrijf",
      website: "esmeebartelink.nl"
    },
    {
      id: 95,
      name: "Jeroen Koeten Fotografie",
      description: "Zakelijke fotografie website drukwerk zakelijke portretten",
      website: "jeroenkoeten.nl"
    },
    {
      id: 96,
      name: "BPIRY Photography",
      description: "Professionele bedrijfsfotograaf zakelijk opzoek naar foto's",
      website: "bpiryphotography.nl"
    },
    {
      id: 97,
      name: "Joppe Fotografie Groningen",
      description: "Zakelijke portretfotografie op locatie fotografie beeldbank reportages",
      website: "joppefotografie.nl"
    },
    {
      id: 98,
      name: "Digna ten Napel",
      description: "Bedrijfsfotografie portretfotografie op maat sfeer uitstraling organisatie",
      website: "dignatennapel.nl"
    },
    {
      id: 99,
      name: "Eveleens Fotografie",
      description: "Zakelijke evenementen congressen galadiners open dag vastleggen",
      website: "eveleens-fotografie.nl"
    },
    {
      id: 100,
      name: "B2Design",
      description: "Bedrijfsfotografie foto's op locatie kantoor pand object",
      website: "b2design.nl"
    },
    {
      id: 101,
      name: "Stephan Keereweer Fotografie",
      description: "Zakelijke portretten lifestyle en commerciële fotografie",
      website: "stephankeereweer.nl"
    },
    {
      id: 102,
      name: "Jantina Fotografie",
      description: "Puur en krachtig zakelijke foto's met echtheid en karakter",
      website: "zakelijk.jantinafotografie.nl"
    },
    {
      id: 103,
      name: "Casper Maas",
      description: "Zakelijke portret fotoshoot op locatie foto's personeel",
      website: "caspermaas.com"
    },
    {
      id: 104,
      name: "Foto Nijkamp",
      description: "Zakelijke fotografie vastgoed portret bruiloft reportage 360° fotografie",
      website: "fotonijkamp.nl"
    },
    {
      id: 105,
      name: "Marloes Fotografie",
      description: "Bedrijfsfotografie alles wat bedrijf aan beeld nodig heeft",
      website: "marloesfotografie.nl"
    },
    {
      id: 106,
      name: "Nathalie Schram Photography",
      description: "Portretfoto's zakelijke foto's bedrijfsfotografie",
      website: "nathalieschram.nl"
    },
    {
      id: 107,
      name: "LS Fotografie",
      description: "Zakelijke fotografie en trouwfotograaf Groningen",
      website: "lsfotografie.nl"
    },
    {
      id: 108,
      name: "Henk Veenstra Fotografie",
      description: "Freelance fotograaf portret op locatie van muzikant tot CEO",
      website: "henx.nl"
    },
    {
      id: 109,
      name: "Fitbrand",
      description: "Fotoshoot op locatie 25 jaar ervaring lifestyle en promotiefotografie",
      website: "fitbrand.nl"
    },
    {
      id: 110,
      name: "Fotostudio AM",
      description: "Baby kids zwangerschap creatief fashion familie zakelijke fotografie portretten",
      website: "fotostudioam.nl"
    },
    {
      id: 111,
      name: "Bijds Fotografie",
      description: "Bedrijfsheadshots creëer sterk professioneel imago zakelijke portretfoto's",
      website: "bijdsfotografie.nl"
    },
    {
      id: 112,
      name: "Kevin Bekkering",
      description: "Evenement fotograaf Groningen professionele fotografie op locatie",
      website: "kevinbekkering.nl"
    },
    {
      id: 113,
      name: "Peter Fotografie",
      description: "Professionele fotograaf opvallende portretten dating profiel sociale media",
      website: "peterfoto.nl"
    },
    {
      id: 114,
      name: "WebNexus",
      description: "Zakelijke fotografie en video Groningen vertrouwen bezoeker organisatie",
      website: "webnexus.nl"
    },
    {
      id: 115,
      name: "Natasja Nienhuis Fotografie",
      description: "Fine art photography websitefoto's site socials",
      website: "natasjanienhuis.nl"
    },
    {
      id: 116,
      name: "Fotostudio Groningen",
      description: "Perfecte studio voor iedereen fotoshoots shootdagen studio verhuur",
      website: "fotostudiogroningen.nl"
    },
    {
      id: 117,
      name: "Elsbeth Hoekstra Photography",
      description: "Zwangerschap newborn professionele haarstyling make-up exclusieve garderobe",
      website: "ehphoto.nl"
    }
  ],
  almere: [
    {
      id: 101,
      name: "Martine van der Voort",
      description: "Bedrijfsfotograaf voor zakelijke portretten en personal branding",
      website: "martinevandervoort.nl"
    },
    {
      id: 102,
      name: "Fotostudio 87",
      description: "Professionele fotostudio voor stijlvolle shoots in Almere of op locatie",
      website: "fotostudio87.nl"
    },
    {
      id: 103,
      name: "MooiBeeld",
      description: "Effectieve zakelijke fotografie voor jouw merk en bedrijf",
      website: "mooibeeld.nl"
    },
    {
      id: 104,
      name: "Petra Mwaro Fotografie",
      description: "Business shoots in studio Almere starttarief €195",
      website: "petramwaro.nl"
    },
    {
      id: 105,
      name: "Marco ter Beek Photography",
      description: "Creativiteit vakmanschap scherp oog voor detail showroom Argonweg 22",
      website: "marcoterbeekphotography.com"
    },
    {
      id: 106,
      name: "Perla Fotografie",
      description: "Profielfoto zakelijk portret LinkedIn CV website studio Almere",
      website: "perlafotografie.nl"
    },
    {
      id: 107,
      name: "Feenstra Fotografie",
      description: "Zakelijke portretten bedrijfsreportages promotionele foto's videoreportages",
      website: "feenstrafotografie.nl"
    },
    {
      id: 108,
      name: "Anita Neve Fotografie",
      description: "Portretfotografie en productfotografie voor bedrijf en particulier",
      website: "anitaneve.nl"
    },
    {
      id: 109,
      name: "Ridder Fotografie",
      description: "Bedrijfsreportages uurtarief €85 portretfoto's groepen individuen",
      website: "ridder-fotografie.nl"
    },
    {
      id: 110,
      name: "Fotostudio New Brooklyn",
      description: "Zakelijke fotografie business photography persoonlijke fotografie",
      website: "fotostudionewbrooklyn.nl"
    },
    {
      id: 111,
      name: "Arma Fotografie",
      description: "Zakelijk portretten meer dan 600 beelden zakelijke branding",
      website: "armafotografie.nl"
    },
    {
      id: 112,
      name: "Patrick Ouwerkerk Fotografie",
      description: "Bedrijfsreportages portretten marketingbeelden reclamefoto's evenementen",
      website: "patrickouwerkerk.nl"
    },
    {
      id: 113,
      name: "Portretcompany Hans Hogervorst",
      description: "Vakmanschap en passie persoonlijke portretten",
      website: "portretcompany.nl"
    },
    {
      id: 114,
      name: "Jan Dekker Fotograaf",
      description: "Culinair zakelijke fotografie hotels reizen fotograaf Almere",
      website: "jandekkerphoto.nl"
    },
    {
      id: 115,
      name: "Patrick Moses Fotografie",
      description: "Professioneel fotografiebureau Almere en omstreken",
      website: "patrickmoses.nl"
    },
    {
      id: 116,
      name: "Rijshouwer Fotografie",
      description: "Interieur fotografie food fotografie Google bedrijfsfotografie",
      website: "rijshouwerfotografie.com"
    },
    {
      id: 117,
      name: "MediaMere",
      description: "Online marketingbureau diverse fotografen eigen specialisme",
      website: "mediamere.com"
    },
    {
      id: 118,
      name: "Studio34x",
      description: "Professionele fotostudio verhuur videostudio 750 m² twee studio's",
      website: "studio34x.com"
    },
    {
      id: 119,
      name: "Foto Studio Labie",
      description: "Profielfoto CV LinkedIn datingprofiel Baby Booth selfservice",
      website: "fotostudiolabie.nl"
    },
    {
      id: 120,
      name: "Studio Roya",
      description: "Portret verschillende gelegenheden LinkedIn headshot zonnetje zetten",
      website: "studioroya.mypixieset.com"
    },
    {
      id: 121,
      name: "C'est la Vie Photographie",
      description: "Bruidsfotografie en fotoshoots Almere Flevoland omstreken",
      website: "cestlaviephotographie.nl"
    },
    {
      id: 122,
      name: "Refined Moment",
      description: "Automotive lifestyle evenementen bruiloften fotograaf Almere",
      website: "refinedmoment.nl"
    },
    {
      id: 123,
      name: "Brenda Roos Fotografie",
      description: "Flevoland Veluwe kleurrijke sfeervolle fotografie familie bedrijf",
      website: "brendaroos.nl"
    },
    {
      id: 124,
      name: "Nicole Langen Fotografie",
      description: "Pure spontane zwanger baby kids familie fotoshoot Almere",
      website: "nicolelangenfotografie.nl"
    },
    {
      id: 125,
      name: "Vanessen Producties",
      description: "Professionele fotograaf video editor webshop",
      website: "vanessenproducties.nl"
    },
    {
      id: 126,
      name: "Larissa de Vos Fotografie",
      description: "Familie fotoshoot Almere professionele familie fotograaf",
      website: "larissadevosfotografie.nl"
    }
  ],
  haarlem: [
    {
      id: 201,
      name: "Heidi Zakelijke Fotograaf",
      description: "Professionele portretfoto's bedrijfsfoto's zakelijk portretten interieurfotografie",
      website: "zakelijkefotograaf.nl"
    },
    {
      id: 202,
      name: "Fotoshoot.nl Haarlem",
      description: "Professionele fotograaf familieshoot portretten zakelijke foto's personal branding",
      website: "fotoshoot.nl"
    },
    {
      id: 203,
      name: "Fotostudio EdoLand",
      description: "Professionele fotograaf fotostudio sfeervolle fotografie bedrijven ZZP'ers",
      website: "edoland.nl"
    },
    {
      id: 204,
      name: "Jan Pieter Keller",
      description: "Zakelijke fotoshoot profielfoto's teamportretten werkvloer LinkedIn websites",
      website: "janpieterkeller.com"
    },
    {
      id: 205,
      name: "Smile by Marieke",
      description: "Fine art high-end zakelijke portretten fotostudio profielfoto's branding",
      website: "smilebymarieke.nl"
    },
    {
      id: 206,
      name: "Adam van Noort",
      description: "Professionele freelance fotograaf commerciële en fine art fotografie",
      website: "adamvannoort.nl"
    },
    {
      id: 207,
      name: "Mick van Hesteren",
      description: "Bedrijfsfotografie evenementfotografie moderne ongedwongen fotografie ondernemers",
      website: "mickvanhesteren.nl"
    },
    {
      id: 208,
      name: "Caren van Eijle Fotografie",
      description: "Zakelijke fotografie bedrijfsfotografie reportages voor zakelijke doeleinden",
      website: "carenvaneijlefotografie.nl"
    },
    {
      id: 209,
      name: "Joanna Vunderink Photography",
      description: "Top bedrijfsfotograaf levendige zakelijke portretten en reportages",
      website: "joannavunderinkphotography.nl"
    },
    {
      id: 210,
      name: "Helga Beuving",
      description: "Authentieke beelden ondernemer zakelijke portretten karakter lifestyle",
      website: "helgabeuving.nl"
    },
    {
      id: 211,
      name: "Hans Guldemond - I Love Light",
      description: "Helderheid balans goede compositie sterke visuele storytelling",
      website: "hansguldemond.nl"
    },
    {
      id: 212,
      name: "Joyce Goverde",
      description: "Fotografeert voor bedrijven organisaties corporate fotografie",
      website: "joycegoverde.com"
    },
    {
      id: 213,
      name: "Judith den Hollander",
      description: "Zakelijk portret locatie Haarlem Maastricht ondernemers organisaties",
      website: "judithdenhollander.nl"
    },
    {
      id: 214,
      name: "Martijn Hoogendoorn Fotografie",
      description: "Professioneel productfotograaf strakke productfoto's juiste technieken",
      website: "martijnhoogendoornfotografie.nl"
    },
    {
      id: 215,
      name: "Xammes Fotografie",
      description: "Spontane fotograaf ontwerper Vijfhuizen regio Haarlem Amsterdam zakelijke fotografie",
      website: "xammes.nl"
    },
    {
      id: 216,
      name: "Rudenko Photography",
      description: "Creatieve bedrijfsfotograaf authentieke bedrijfsfoto's professionele bedrijfsfotografie",
      website: "rudenko-photography.com"
    },
    {
      id: 217,
      name: "Max van Wijnen Fotografie",
      description: "Professionele fotograaf zwangerschap familie portret fotoshoots",
      website: "maxvanwijnen.nl"
    },
    {
      id: 218,
      name: "Grietje Mesman",
      description: "Bedrijfsfotografie evenementen verbluffende indruk potentiële klanten",
      website: "grietjemesman.nl"
    },
    {
      id: 219,
      name: "Studio Summit",
      description: "Fotografie specialist bedrijfsfotografie productfoto's zakelijke portretten",
      website: "studiosummit.nl"
    },
    {
      id: 220,
      name: "Bmoments",
      description: "Mini-personal branding shoots ondernemers nieuwe foto's website",
      website: "bmoments.nl"
    },
    {
      id: 221,
      name: "101 Fotografie",
      description: "Zakelijk portret professionele zakelijke foto bedrijfsfoto",
      website: "101fotos.nl"
    },
    {
      id: 222,
      name: "Aneta Jeremiasova",
      description: "Elegante zielvolle portretfotografie intieme boudoir professionele branding",
      website: "anetajeremiasova.com"
    },
    {
      id: 223,
      name: "Hannah Hoek Photography",
      description: "Professionele fotograaf schatkamer fotoshoot locaties omgeving Haarlem",
      website: "hannahhoekphotography.nl"
    },
    {
      id: 224,
      name: "De Rooij Fotografie",
      description: "Fotografie cursus workshop basiscursus professionele fotograaf praktijkervaring",
      website: "derooijfotografie.nl"
    },
    {
      id: 225,
      name: "Harlem Creative",
      description: "Fotostudio loopafstand Haarlem Station castingfoto's zakelijke portretten",
      website: "harlemcreative.nl"
    },
    {
      id: 226,
      name: "Arman Ramzi",
      description: "Photography studio portrait commercial life frames event photography",
      website: "armanramzi.com"
    },
    {
      id: 227,
      name: "Toppie Studio",
      description: "Professionele zakelijke portretfoto persoonlijkheid professionaliteit uitstraling",
      website: "toppiestudio.nl"
    }
  ],
  leiden: [
    {
      id: 211,
      name: "Monique Mulder Fotografie",
      description: "Professionele fotoshoot locatie naar keuze ongedwongen spontane journalistieke lifestyle",
      website: "moniquemulder.com"
    },
    {
      id: 212,
      name: "Studio Flows",
      description: "Daglicht studio Leiden volledig gemeubileerde studio 86m² fotografie videografie",
      website: "studioflows.nl"
    },
    {
      id: 213,
      name: "Bedrijfsfotografie.nl Leiden",
      description: "Rogier Chang bedrijfsfotograaf 20 jaar ervaring essentie bedrijf prachtige beelden",
      website: "bedrijfsfotografie.nl"
    },
    {
      id: 214,
      name: "Co-creator Fotografie",
      description: "Zakelijk eventfotograaf belangrijkste momenten unieke eigenschappen organisatie evenement",
      website: "co-creator.nu"
    },
    {
      id: 215,
      name: "Claudias Camera",
      description: "Karaktervolle portretfotografie privé zakelijk social media bedrijfswebsites",
      website: "claudiascamera.com"
    },
    {
      id: 216,
      name: "Max van Wijnen Fotografie",
      description: "Fotostudio Leiden zakelijke portretfoto's zwangerschap familie portret fotoshoots",
      website: "maxvanwijnen.nl"
    },
    {
      id: 217,
      name: "Lotje Fotografeert",
      description: "Zakelijke fotografie Bollenstreek minimale sturing vrijheid professioneel vriendelijk",
      website: "lotjefotografeert.nl"
    },
    {
      id: 218,
      name: "Monique Shaw Fotografie",
      description: "Portretfotografie professionele profielfoto's zakelijke portretten natuurlijk ontspannen",
      website: "shawfotografie.nl"
    },
    {
      id: 219,
      name: "Danitsja Larissa Fotografie",
      description: "Professionele fotograaf Leiden jarenlange ervaring fotoshoot",
      website: "danitsjalarissafotografie.nl"
    },
    {
      id: 220,
      name: "Xammes Fotografie Leiden",
      description: "Zakelijk portretfotografie mooie portretfoto's professioneel",
      website: "xammes.nl"
    },
    {
      id: 221,
      name: "Mike van Bemmelen",
      description: "Sympathieke zakelijke portret profielfoto's beste professionele versie",
      website: "fotografievanbemmelen.nl"
    },
    {
      id: 222,
      name: "Henry's Photodesign",
      description: "Bedrijfsfotograaf bekende klik ideale klant zakelijke portretten branding fotografie",
      website: "henrysphotodesign.nl"
    },
    {
      id: 223,
      name: "Martijn Hoogendoorn Fotografie",
      description: "Enthousiast fotograaf ondernemers producten spotlight professionele fotografie",
      website: "martijnhoogendoornfotografie.nl"
    },
    {
      id: 224,
      name: "Eveleens Fotografie",
      description: "LinkedIn foto's redactionele portretten complete website-shoot zakelijke evenementen",
      website: "eveleens-fotografie.nl"
    },
    {
      id: 225,
      name: "FotoSynthese",
      description: "Bruiloftfotografie boudoirfotografie fotoshoots bedrijfsfotografie evenementen websites",
      website: "fotosynthese.art"
    },
    {
      id: 226,
      name: "Joris Aben Fotografie",
      description: "Professionele fotodiensten particuliere zakelijke markt",
      website: "fotograaf-info.nl"
    },
    {
      id: 227,
      name: "Dreamcapture",
      description: "Moderne fotostudio verhuur Leiden creatieve projecten fotografie videografie",
      website: "dreamcapture.nl"
    },
    {
      id: 228,
      name: "Onemotion",
      description: "Professionele fotoshoot vanaf €25 vrijgezellenfeest regio Noordwijk Katwijk",
      website: "onemotion.nl"
    },
    {
      id: 229,
      name: "Danielle van der Spek Fotografie",
      description: "Zakelijke portretfotografie krachtige authentieke profielfoto's LinkedIn websites",
      website: "fotografiedaniellevanderspek.nl"
    },
    {
      id: 230,
      name: "Iris Foto Maken",
      description: "Speciale macrofotografie oog vastleggen allerkleinste detail",
      website: "irisfotomaken.nl"
    },
    {
      id: 231,
      name: "Happyfocus Fotografie",
      description: "Newborn bruiloften reportages zwangerschapsshoots familie profielfoto's bedrijfsfotografie",
      website: "happyfocus.nl"
    },
    {
      id: 232,
      name: "Par-pa Fotografie",
      description: "35 jaar ervaring all-round fotograaf vastleggen herinnering",
      website: "par-pa.nl"
    },
    {
      id: 233,
      name: "Helena and Sisters",
      description: "Newborn bruidsfotografie portretfotografie bedrijfsfotografie verschillende stijlen",
      website: "helenaandsisters.com"
    },
    {
      id: 234,
      name: "Wilke Geurds",
      description: "Zakelijke bedrijfsfotografie professionele foto's event portret groepsfoto's sfeerfoto's",
      website: "wilkegeurds.nl"
    },
    {
      id: 235,
      name: "Dreamcapture Studios",
      description: "Fotostudio verhuur Leiden Daydream Moonlight Studio creatieve ruimtes",
      website: "dreamcapturestudios.nl"
    },
    {
      id: 236,
      name: "Rudenko Photography Leiden",
      description: "Sfeervolle fotoshoot professionele fotograaf levendige foto's hoogwaardige fotografie",
      website: "rudenko-photography.com"
    },
    {
      id: 237,
      name: "Digra Photography",
      description: "Zakelijke fotografie naakt poseren voorbeeld films voorbereiding",
      website: "digraphotography.com"
    },
    {
      id: 238,
      name: "Woningperspectief",
      description: "Woningfotografie NEN2580 plattegronden woningvideo's makelaars mooiste beelden",
      website: "woningperspectief.nl"
    },
    {
      id: 239,
      name: "SoulShoots",
      description: "Cake smash kindvriendelijke aanpak geduld creativiteit stressvrije fotoshoot",
      website: "soulshoots.com"
    }
  ],
  
  // ALLE 12 PROVINCIES - nieuwe steden
  assen: [
    { id: 301, name: "Fotostudio Assen", description: "Professionele fotostudio in het centrum van Assen", website: "fotostudioassen.nl" },
    { id: 302, name: "Drentse Portretten", description: "Gespecialiseerd in portret- en familiefotografie", website: "drentseportretten.nl" },
    { id: 303, name: "Fotografie van der Berg", description: "Zakelijke en particuliere fotografie in Drenthe", website: "fotografievandenberg-assen.nl" },
    { id: 304, name: "Studio Drenthe", description: "Moderne fotostudio met uitgebreide faciliteiten", website: "studiodrenthe.nl" },
    { id: 305, name: "Beeldmakers Assen", description: "Creatieve beeldvorming en professionele fotografie", website: "beeldmakersassen.nl" },
    { id: 306, name: "Fotografie de Jong", description: "Portret- en evenementenfotografie specialist", website: "fotografiedejong-assen.nl" },
    { id: 307, name: "Licht & Lens Drenthe", description: "Artistieke fotografie met natuurlijk licht", website: "lichtlensdrenthe.nl" },
    { id: 308, name: "Kiekjes Assen", description: "Toegankelijke fotografie voor iedereen", website: "kiekjesassen.nl" },
    { id: 309, name: "Fotostudio Centrum", description: "Fotostudio nabij het centrum van Assen", website: "fotostudiocentrum-assen.nl" },
    { id: 310, name: "Asser Beeldvorming", description: "Professionele beeldvorming en zakelijke fotografie", website: "asserbeeldvorming.nl" }
  ],
  
  leeuwarden: [
    { id: 311, name: "Friese Fotografie", description: "Authentieke Friese fotografie en portretten", website: "friesefotografie.nl" },
    { id: 312, name: "Studio Leeuwarden", description: "Professionele fotostudio in de Friese hoofdstad", website: "studioleeuwarden.nl" },
    { id: 313, name: "Fotografie Fryslân", description: "Specialisten in Friese cultuur en landschapsfotografie", website: "fotografiefryslan.nl" },
    { id: 314, name: "Beeldmakers Friesland", description: "Creatieve beeldvorming in hart van Friesland", website: "beeldmakersfriesland.nl" },
    { id: 315, name: "Ljouwerter Foto", description: "Lokale fotograaf gespecialiseerd in portretten", website: "ljouwerterfoto.nl" },
    { id: 316, name: "Waterlandfotografie", description: "Natuur- en portretfotografie in waterrijk Friesland", website: "waterlandfotografie.nl" },
    { id: 317, name: "Studio 058", description: "Moderne fotostudio in Leeuwarden", website: "studio058.nl" },
    { id: 318, name: "Friese Portretten", description: "Gespecialiseerd in karaktervolle portretten", website: "frieseportretten.nl" },
    { id: 319, name: "Kiekjes Leeuwarden", description: "Toegankelijke fotografie in Leeuwarden", website: "kiekjesleeuwarden.nl" },
    { id: 320, name: "Fotostudio Elfsteden", description: "Fotostudio vernoemd naar de beroemde Elfstedentocht", website: "fotostudioelfsteden.nl" }
  ],
  
  arnhem: [
    { id: 321, name: "Gelderse Fotografie", description: "Professionele fotografie in de hoofdstad van Gelderland", website: "geldersefotografie.nl" },
    { id: 322, name: "Studio Arnhem", description: "Moderne fotostudio nabij het centrum", website: "studioarnhem.nl" },
    { id: 323, name: "Veluwse Portretten", description: "Natuurlijke portretten met Veluwse achtergrond", website: "veluwseportretten.nl" },
    { id: 324, name: "Beeldmakers Gelderland", description: "Creatieve beeldvorming in Gelderland", website: "beeldmakersgelderland.nl" },
    { id: 325, name: "Fotografie Rijn", description: "Fotograaf nabij de Rijn in Arnhem", website: "fotografierijn.nl" },
    { id: 326, name: "Park Sonsbeek Foto", description: "Natuurfotografie en portretten bij Park Sonsbeek", website: "parksonsbeekfoto.nl" },
    { id: 327, name: "Studio 026", description: "Professionele fotostudio in Arnhem", website: "studio026.nl" },
    { id: 328, name: "Arnhemse Beeldvorming", description: "Zakelijke en particuliere fotografie", website: "arnhemsebeeldvorming.nl" },
    { id: 329, name: "Kiekjes Arnhem", description: "Toegankelijke fotografie voor iedereen", website: "kiekjesarnhem.nl" },
    { id: 330, name: "Fotostudio Presikhaaf", description: "Fotostudio in de wijk Presikhaaf", website: "fotostudiopresikhaaf.nl" }
  ],
  
  maastricht: [
    { id: 331, name: "Limburgse Fotografie", description: "Bourgondische fotografie in het zuiden", website: "limburgsefotografie.nl" },
    { id: 332, name: "Studio Maastricht", description: "Professionele fotostudio in de heuvels", website: "studiomaastricht.nl" },
    { id: 333, name: "Maasfotografie", description: "Fotograaf aan de oevers van de Maas", website: "maasfotografie.nl" },
    { id: 334, name: "Beeldmakers Limburg", description: "Creatieve beeldvorming in Limburg", website: "beeldmakerslimburg.nl" },
    { id: 335, name: "Heuvelland Foto", description: "Karakteristieke fotografie in het heuvellandschap", website: "heuvellandfoto.nl" },
    { id: 336, name: "Carnaval Portretten", description: "Specialist in feestelijke en zakelijke portretten", website: "carnavalportretten.nl" },
    { id: 337, name: "Studio 043", description: "Moderne fotostudio in Maastricht", website: "studio043.nl" },
    { id: 338, name: "Maastrichtse Beeldvorming", description: "Professionele beeldvorming en fotografie", website: "maastrichtsebeeldvorming.nl" },
    { id: 339, name: "Kiekjes Maastricht", description: "Toegankelijke fotografie in Maastricht", website: "kiekjesmaastricht.nl" },
    { id: 340, name: "Fotostudio Wyck", description: "Fotostudio in de historische wijk Wyck", website: "fotostudiowyck.nl" }
  ],
  
  zwolle: [
    { id: 341, name: "Hanzestad Fotografie", description: "Historische en moderne fotografie in Zwolle", website: "hanzestadtofografie.nl" },
    { id: 342, name: "Studio Zwolle", description: "Professionele fotostudio in Overijssel", website: "studiozwolle.nl" },
    { id: 343, name: "IJsselfotografie", description: "Fotograaf aan de IJssel in Zwolle", website: "ijsselfotografie.nl" },
    { id: 344, name: "Beeldmakers Overijssel", description: "Creatieve beeldvorming in Overijssel", website: "beeldmakersoverijssel.nl" },
    { id: 345, name: "Zwolse Portretten", description: "Karaktervolle portretten in Zwolle", website: "zwolseportretten.nl" },
    { id: 346, name: "Sassenpoort Foto", description: "Fotografie nabij het historische Sassenpoort", website: "sassenpoortfoto.nl" },
    { id: 347, name: "Studio 038", description: "Moderne fotostudio in Zwolle", website: "studio038.nl" },
    { id: 348, name: "Zwolse Beeldvorming", description: "Professionele beeldvorming en fotografie", website: "zwolsebeeldvorming.nl" },
    { id: 349, name: "Kiekjes Zwolle", description: "Toegankelijke fotografie voor iedereen", website: "kiekjeszwolle.nl" },
    { id: 350, name: "Fotostudio Stadshagen", description: "Fotostudio in de wijk Stadshagen", website: "fotostudiostadshagen.nl" }
  ],
  
  middelburg: [
    { id: 351, name: "Zeeuwse Fotografie", description: "Kustfotografie en portretten in Zeeland", website: "zeeuwsefotografie.nl" },
    { id: 352, name: "Studio Middelburg", description: "Professionele fotostudio in de Zeeuwse hoofdstad", website: "studiomiddelburg.nl" },
    { id: 353, name: "Kustlijnfotografie", description: "Specialist in kust- en natuurfotografie", website: "kustlijnfotografie.nl" },
    { id: 354, name: "Beeldmakers Zeeland", description: "Creatieve beeldvorming aan de kust", website: "beeldmakerszeeland.nl" },
    { id: 355, name: "Zeeuwse Portretten", description: "Karaktervolle portretten met zeeuwse flair", website: "zeeuwseportretten.nl" },
    { id: 356, name: "Abdijfotografie", description: "Fotografie nabij de historische abdij", website: "abdijfotografie.nl" },
    { id: 357, name: "Studio 0118", description: "Moderne fotostudio in Middelburg", website: "studio0118.nl" },
    { id: 358, name: "Middelburgse Beeldvorming", description: "Professionele beeldvorming en fotografie", website: "middelburgsebeeldvorming.nl" },
    { id: 359, name: "Kiekjes Middelburg", description: "Toegankelijke fotografie in Middelburg", website: "kiekjesmiddelburg.nl" },
    { id: 360, name: "Fotostudio Walcheren", description: "Fotostudio op het eiland Walcheren", website: "fotostudiowalcheren.nl" }
  ],
  
  // GROTE STEDEN - uitbreiding
  nijmegen: [
    {
      id: 401,
      name: "Photoyou Magdalena Heijting",
      description: "Zakelijke fotografie bedrijfsreportage goede service mooie beelden veel ervaring mogelijkheden",
      website: "photoyou.nl"
    },
    {
      id: 402,
      name: "Fleur Janssen Fotografie",
      description: "Bedrijfsfotograaf Nijmegen ontspannen sfeer foto's bedrijf kwaliteit oogopslag herkennen",
      website: "fleurjanssen.nl"
    },
    {
      id: 403,
      name: "Michiel Heijmans",
      description: "Bedrijfsfotografie Nijmegen team professioneel beeld heldere krachtige zakelijke portretten",
      website: "michielheijmans.com"
    },
    {
      id: 404,
      name: "Raoul van Meel Fotografie",
      description: "Bedrijfsfotografie Nijmegen Arnhem betaalbaar betrokken zakelijke fotografie hart",
      website: "raoulvanmeelfotografie.nl"
    },
    {
      id: 405,
      name: "Picture Productions",
      description: "Hans Hebbink bedrijfsfotograaf Nijmegen 25 jaar ervaring industriefotografie zakelijke portretfotografie video",
      website: "pictureproductions.nl"
    },
    {
      id: 406,
      name: "MooiBeeld",
      description: "Strategische fotografie marketingdoeleinden bedrijfs portret productfotografie verhaal vertellen",
      website: "mooibeeld.nl"
    },
    {
      id: 407,
      name: "Linda Verweij Fotografie",
      description: "Ervaren bedrijfsfotograaf Nijmegen ondernemers bedrijven krachtige visuele identiteit",
      website: "linda-verweij.nl"
    },
    {
      id: 408,
      name: "Jurriaan Huting",
      description: "Professionele lifestyle bedrijfsfotografie Nijmegen personal branding visuele storytelling ondernemers",
      website: "huting.net"
    },
    {
      id: 409,
      name: "Chrissie Sewalt Branding Fotografie",
      description: "Zakelijke fotografie ondernemers verhaal vertellen online zichtbaarheid pure ontspannen",
      website: "chrissiesewalt.nl"
    },
    {
      id: 410,
      name: "Bijzondere Bedrijfsportretten",
      description: "Zakelijk fotograaf fotoshoot portretfoto groepsfoto bedrijfslocatie op maat medewerkers",
      website: "bijzonderebedrijfsportretten.nl"
    },
    {
      id: 411,
      name: "Joppe Fotografie Nijmegen",
      description: "Bedrijfsfotografie Nijmegen uitstekend middel producten diensten visualiseren",
      website: "joppefotografie.nl"
    },
    {
      id: 412,
      name: "OLIVR",
      description: "Hoogwaardige zakelijke fotografie regio Nijmegen zzp'ers grotere organisaties",
      website: "olivr.nl"
    },
    {
      id: 413,
      name: "Meelfabriek Marketing",
      description: "Zakelijke fotografie 15 jaar professioneel fotograaf persoonlijke beelden",
      website: "meelfabriekmarketing.nl"
    },
    {
      id: 414,
      name: "Cine Chefs",
      description: "Zakelijke portretten campagnefoto's productfoto's eventfotografie meedenken",
      website: "cinechefs.com"
    },
    {
      id: 415,
      name: "Maurice Jager Fotostudio",
      description: "Fotostudio Nijmegen mooiste portretten familieportret zakelijke profielfoto expertise",
      website: "mauricejager.com"
    },
    {
      id: 416,
      name: "Wouter Loeve Nice Pictures",
      description: "Professioneel fotograaf muziek evenementen zakelijke fotografie videograaf",
      website: "nicepictures.nl"
    },
    {
      id: 417,
      name: "Gerard van Roekel Fotografie",
      description: "Zakelijke fotograaf Nijmegen bedrijven beelden krachtig authentiek visueel aantrekkelijk",
      website: "gerardvanroekel.nl"
    },
    {
      id: 418,
      name: "Broxks Fotografie",
      description: "Michael Broxks beste fotograaf Nijmegen professionele fotoshoot",
      website: "broxks-fotografie.nl"
    },
    {
      id: 419,
      name: "Leafsum",
      description: "Zakelijke fotografie branding business versterken nieuwe klanten klantbinding",
      website: "leafsum.nl"
    },
    {
      id: 420,
      name: "Sharon Willems",
      description: "Fotograaf Nijmegen Den Bosch professionele actiefoto's zakelijke portretfoto's productfoto's",
      website: "sharonwillems.nl"
    },
    {
      id: 421,
      name: "Matthijs van Houten",
      description: "Krachtige portretten bruiloften evenementen bedrijfsreportages",
      website: "matthijsvanhouten.com"
    },
    {
      id: 422,
      name: "Christina Eichelsheim",
      description: "Zakelijke portretten foto's diensten producten visuele identiteit verhaal klanten aanspreekt",
      website: "fotografiechristina.nl"
    },
    {
      id: 423,
      name: "Studio Ten Tusscher Nijmegen",
      description: "Foodfotografie krachtige bedrijfsfotografie onvergetelijk eventfotografie",
      website: "studiotentusscher.nl"
    },
    {
      id: 424,
      name: "Made by Luustienstra",
      description: "Zakelijke portretten locatie Betuwe puur stijlvol oog detail uitgebreide shoot verhaal",
      website: "madebyluustienstra.nl"
    },
    {
      id: 425,
      name: "Bart van Dieken Fotografie",
      description: "Diverse zakelijke opdrachtgevers aangewezen fotograaf Nijmegen beelddenker buitenmens",
      website: "bartvandieken.com"
    },
    {
      id: 426,
      name: "Robert van Grinsven Fotografie",
      description: "Business portret Nijmegen portret modelfotograaf prima kwaliteit prettige manier",
      website: "robertvangrinsven.nl"
    },
    {
      id: 427,
      name: "Flitsend Beeld",
      description: "Professionele fotografie Nijmegen portret familie zakelijke fotoshoot",
      website: "flitsendbeeld.nl"
    },
    {
      id: 428,
      name: "As You Were Reclamebureau",
      description: "Portretfotografie merk tot leven relaties opbouwen terugkerende klanten positieve ervaringen",
      website: "asyouwere.nl"
    },
    {
      id: 429,
      name: "Wen Versteeg",
      description: "Professionele fotograaf Nijmegen fotoshoot uur €120 10 foto's hoge resolutie",
      website: "wenversteeg.nl"
    },
    {
      id: 430,
      name: "Marcel Krijgsman",
      description: "Creatieve fotograaf Nijmegen sterke muziekfotografie levendig editorial fotografie portretten",
      website: "marcelkrijgsman.nl"
    },
    {
      id: 431,
      name: "Rob Lammerts Fotografie",
      description: "Professionele fotoshoot 60 minuten 1-8 personen 20 digitale foto's",
      website: "socialdeal.nl"
    }
  ],
  
  breda: [
    {
      id: 411,
      name: "LINK Fotografie Breda",
      description: "Professionele bedrijfsfotografie portretfotografie profielfoto zakelijk portret bedrijfsfotograaf Utrecht Breda",
      website: "linkfotografie.nl"
    },
    {
      id: 412,
      name: "Artstudio23",
      description: "Zakelijke fotografie workshops moderne profielfoto bijzondere avatar studio bedrijfslocatie website webshop reclame",
      website: "artstudio23.com"
    },
    {
      id: 413,
      name: "Artorial Photography",
      description: "Professionele fotoshoots Breda locatie portret zwangerschap polaroid zakelijke fotografie online boeken",
      website: "artorialphotography.com"
    },
    {
      id: 414,
      name: "Else Loof Fotografie",
      description: "Specialist zakelijke fotografie professionele authentieke spontane foto's lief mens planeet authentieke beelden",
      website: "elseloof.nl"
    },
    {
      id: 415,
      name: "Lianne Dekker Fotografie",
      description: "Zakelijke fotografie grafisch design Dordrecht Breda contact informatie",
      website: "liannedekker.nl"
    },
    {
      id: 416,
      name: "Studio Aksento",
      description: "Fotograaf Breda zakelijke fotografie opdrachtgevers productie diensten sector reclame professioneel creatief",
      website: "aksento.com"
    },
    {
      id: 417,
      name: "De Oppakkers",
      description: "Bedrijfsfotograaf Breda professionele bedrijfsfoto's website social media tarieven",
      website: "deoppakkers.nl"
    },
    {
      id: 418,
      name: "Erald van der Aa Fotografie",
      description: "Fotograaf Breda bedrijven particulieren zakelijke portretten studiofotografie bruidsfotografie portretfotografie gezins",
      website: "eraldvanderaa.nl"
    },
    {
      id: 419,
      name: "Het Communicatiemeisje",
      description: "Lifestyle zakelijke fotograaf Breda famlieshoot zakelijke fotografie website social media kanalen",
      website: "hetcommunicatiemeisje.nl"
    },
    {
      id: 420,
      name: "Zakelijkeportretten.com",
      description: "Zakelijke fotografie headshots portretten kosten 100 euro uur exclusief BTW bulkmogelijkheden",
      website: "zakelijkeportretten.com"
    },
    {
      id: 421,
      name: "Erik Dukker",
      description: "Opmerkelijke zakelijke portretten Breda lokale klanten fotografie mobiele studio professionele foto's",
      website: "erikdukker.nl"
    },
    {
      id: 422,
      name: "Grow by Visuals",
      description: "Fotograaf Breda mooie beelden krachtige foto's verhalen vertellen zakelijke fotoshoot brandingreportage",
      website: "growbyvisuals.com"
    },
    {
      id: 423,
      name: "StudioRAW",
      description: "Zakelijke professionele portretfoto's maat fotostudio Breda gewenste locatie mobiele fotostudio",
      website: "studioraw.eu"
    },
    {
      id: 424,
      name: "Robert Aarts Photography",
      description: "Gespecialiseerde fotograaf Breda jarenlange ervaring concertfotografie foodfotografie hospitalityfotografie",
      website: "robertaarts.nl"
    },
    {
      id: 425,
      name: "Joppe Fotografie Breda",
      description: "Bedrijfsfotografie Breda beeldmateriaal website presentaties ijzersterke pitch nieuwsartikel",
      website: "joppefotografie.nl"
    },
    {
      id: 426,
      name: "DLogic Webdesign",
      description: "Bedrijfsfotografie specialisatie vastleggen zakelijke aspecten onderneming",
      website: "dlogic.nl"
    },
    {
      id: 427,
      name: "Petra Janssen Fotografie",
      description: "Zakelijke fotoshoot Breda €299 inclusief 10 professioneel bewerkte digitale fotobestanden kleur zwart wit",
      website: "petrajanssenfotografie.nl"
    },
    {
      id: 428,
      name: "DSPH",
      description: "Specialisten effectieve fotografie film campagnes full-service audiovisueel bedrijf zakelijke markt",
      website: "dsph.eu"
    },
    {
      id: 429,
      name: "Marleen Hoftijzer",
      description: "Fotograaf Breda bedrijven events originele fotografie zakelijke portretten bedrijfsreportages events locatie",
      website: "marleenhoftijzer.com"
    },
    {
      id: 430,
      name: "Studio Gaby Ermstrang",
      description: "Studiofotografie Heuvelstraat creatieve studio portretten liefde plezier gemaakt Breda",
      website: "studiogabyermstrang.nl"
    },
    {
      id: 431,
      name: "Judith Adriaansen Fotografie",
      description: "Portretfotograaf Breda Etten-Leur Dordrecht zakelijke portretfoto's content materiaal beste manier",
      website: "judithadriaansenfotografie.nl"
    },
    {
      id: 432,
      name: "Kaige Productions",
      description: "Fotografie Breda mediaproductie vastgoedfotografie portretfotografie drone productfotografie evenementfotografie",
      website: "kaige.nl"
    },
    {
      id: 433,
      name: "Mea Fotografie",
      description: "Brandingshoot fotografeer bedrijven producten ruimtes actualiteit realistische foto's mensen",
      website: "meafotografie.nl"
    },
    {
      id: 434,
      name: "Patricia Mallens Fotografie",
      description: "Fotograaf Breda gezins portretfotografie zakelijke portretten gezinsfoto's artistieke portretten studio buiten",
      website: "patriciamallensfotografie.nl"
    },
    {
      id: 435,
      name: "Evelien Hogers",
      description: "Zakelijke fotoshoot Brabant zakelijke foto's kantoor thuis beeldbank fotoshoot locatie",
      website: "evelienhogers.com"
    },
    {
      id: 436,
      name: "Sprangers Fotografie",
      description: "Fotoshoot studio Ulvenhout zuiden Breda pasfoto paspoort visa",
      website: "sprangersfoto.nl"
    },
    {
      id: 437,
      name: "Fabrizio Photography",
      description: "Professionele fotografie gespecialiseerd kinderen bruiloft portret newborn zwangerschap familie service details",
      website: "fabriziophotos.com"
    },
    {
      id: 438,
      name: "Felix Foto",
      description: "Professionele portretfoto's dicht mogelijk jezelf zakelijke portret foto's persoonlijk gebruik",
      website: "felix-foto.nl"
    },
    {
      id: 439,
      name: "Beeldend Floor",
      description: "Ontspannen fotograaf nabij Breda deskundig ideeën wensen werkelijkheid mooiste momenten fotostudio",
      website: "beeldendfloor.nl"
    },
    {
      id: 440,
      name: "Bart van Vlijmen Fotografie",
      description: "Event fotografie Breda perfecte fotoreportages bijzondere evenement onvergetelijk",
      website: "bartvanvlijmen.nl"
    },
    {
      id: 441,
      name: "Ermstrang Fotografie",
      description: "Tarievenlijst fotoshoot Breda familieshoot studio digitale foto's buiten zakelijke portret",
      website: "ermstrangfotografie.nl"
    },
    {
      id: 442,
      name: "KK Fotografie",
      description: "Zakelijke portret fotoshoot hartje Breda presentatiecoach authentieke foto's website sociale media beeldvorming",
      website: "kkfotografie.com"
    },
    {
      id: 443,
      name: "Nicole den Harder",
      description: "Bedrijfsfotograaf Breda Roosendaal Brabant onderneming professionele creatieve manier presenteren",
      website: "nicoledenharder.com"
    },
    {
      id: 444,
      name: "Wolf Online Marketing",
      description: "Bedrijfsfotografie Breda lachen alsjeblieft fotografie bedrijf professionele nabewerking contact",
      website: "wolfonlinemarketing.com"
    }
  ],
  
  alkmaar: [
    { id: 421, name: "Alkmaarse Fotografie", description: "Kaasstad fotografie met karakter", website: "alkmaarsfotografie.nl" },
    { id: 422, name: "Studio Alkmaar", description: "Professionele fotostudio in Alkmaar", website: "studioalkmaar.nl" },
    { id: 423, name: "Kaasmarkt Foto", description: "Fotograaf nabij de beroemde kaasmarkt", website: "kaasmarktfoto.nl" },
    { id: 424, name: "Noord-Hollandse Beeldvorming", description: "Regionale beeldvorming Noord-Holland", website: "noordhollandsebeeldvorming.nl" },
    { id: 425, name: "Bergermeer Fotografie", description: "Natuur- en portretfotografie", website: "bergermeerfotografie.nl" },
    { id: 426, name: "Beeldmakers Alkmaar", description: "Creatieve beeldvorming in Alkmaar", website: "beeldmakersalkmaar.nl" },
    { id: 427, name: "Kiekjes Alkmaar", description: "Toegankelijke fotografie voor iedereen", website: "kiekjesalkmaar.nl" },
    { id: 428, name: "Studio Overdie", description: "Fotostudio in wijk Overdie", website: "studiooverdie.nl" },
    { id: 429, name: "Alkmaarse Beeldvorming", description: "Professionele beeldvorming en fotografie", website: "alkmaarsebeeldvorming.nl" },
    { id: 430, name: "Fotostudio Doelenstraat", description: "Centraal gelegen fotostudio", website: "fotostudiodoelenstraat.nl" }
  ]
}

export default function StadFotografenPage() {
  const params = useParams()
  const stad = params.stad as string
  
  const [photographers, setPhotographers] = useState<any[]>([])
  const [filteredPhotographers, setFilteredPhotographers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const cityNames: { [key: string]: string } = {
    // Bestaande steden
    amsterdam: "Amsterdam",
    rotterdam: "Rotterdam", 
    "den-haag": "Den Haag",
    utrecht: "Utrecht",
    eindhoven: "Eindhoven",
    tilburg: "Tilburg",
    groningen: "Groningen",
    almere: "Almere",
    
    // Nieuwe steden met echte fotografen alfabetisch
    haarlem: "Haarlem",
    leiden: "Leiden",
    
    // ALLE 12 PROVINCIES - nieuwe hoofdsteden
    assen: "Assen",
    leeuwarden: "Leeuwarden", 
    arnhem: "Arnhem",
    maastricht: "Maastricht",
    zwolle: "Zwolle",
    middelburg: "Middelburg",
    
    // Grote steden
    nijmegen: "Nijmegen",
    breda: "Breda", 
    apeldoorn: "Apeldoorn",
    enschede: "Enschede",
    "s-hertogenbosch": "'s-Hertogenbosch",
    heerlen: "Heerlen",
    venlo: "Venlo",
    alkmaar: "Alkmaar",
    lelystad: "Lelystad",
    
    // Historische steden
    delft: "Delft",
    gouda: "Gouda",
    deventer: "Deventer", 
    kampen: "Kampen",
    
    // Kust/eiland steden
    vlissingen: "Vlissingen",
    goes: "Goes",
    
    // Noord-Holland
    edam: "Edam",
    enkhuizen: "Enkhuizen",
    hoorn: "Hoorn",
    naarden: "Naarden",
    noordwijk: "Noordwijk",
    volendam: "Volendam",
    zaandam: "Zaandam",
    zandvoort: "Zandvoort",
    
    // Zuid-Holland
    brielle: "Brielle",
    delft: "Delft",
    dordrecht: "Dordrecht",
    gorinchem: "Gorinchem",
    gouda: "Gouda",
    schoonhoven: "Schoonhoven",
    
    // Utrecht
    amersfoort: "Amersfoort",
    maarssen: "Maarssen",
    vianen: "Vianen",
    "wijk-bij-duurstede": "Wijk bij Duurstede",
    woerden: "Woerden",
    
    // Gelderland
    apeldoorn: "Apeldoorn",
    arnhem: "Arnhem",
    culemborg: "Culemborg",
    doesburg: "Doesburg",
    elburg: "Elburg",
    harderwijk: "Harderwijk",
    hattem: "Hattem",
    nijmegen: "Nijmegen",
    zaltbommel: "Zaltbommel",
    zutphen: "Zutphen",
    
    // Noord-Brabant
    "bergen-op-zoom": "Bergen op Zoom",
    breda: "Breda",
    geertruidenberg: "Geertruidenberg",
    grave: "Grave",
    "oosterhout-nb": "Oosterhout",
    "den-bosch": "'s-Hertogenbosch",
    
    // Limburg
    heerlen: "Heerlen",
    maastricht: "Maastricht",
    roermond: "Roermond",
    sittard: "Sittard",
    valkenburg: "Valkenburg",
    venlo: "Venlo",
    
    // Overijssel
    almelo: "Almelo",
    blokzijl: "Blokzijl",
    deventer: "Deventer",
    enschede: "Enschede",
    giethoorn: "Giethoorn",
    kampen: "Kampen",
    zwolle: "Zwolle",
    
    // Friesland
    dokkum: "Dokkum",
    franeker: "Franeker",
    harlingen: "Harlingen",
    heerenveen: "Heerenveen",
    leeuwarden: "Leeuwarden",
    lemmer: "Lemmer",
    sneek: "Sneek",
    
    // Groningen
    appingedam: "Appingedam",
    bourtange: "Bourtange",
    winschoten: "Winschoten",
    
    // Drenthe
    assen: "Assen",
    coevorden: "Coevorden",
    emmen: "Emmen",
    hoogeveen: "Hoogeveen",
    meppel: "Meppel",
    veendam: "Veendam",
    
    // Flevoland
    lelystad: "Lelystad",
    
    // Zeeland
    goes: "Goes",
    middelburg: "Middelburg",
    sluis: "Sluis",
    vlissingen: "Vlissingen",
    willemstad: "Willemstad",
    zierikzee: "Zierikzee",
    zoutelande: "Zoutelande"
  }

  const stadNaam = cityNames[stad] || stad


  useEffect(() => {
    let cityKey = stad
    if (stad === "den haag" || stad === "den%20haag") {
      cityKey = "den-haag"
    }
    
    const data = photographersData[cityKey] || []
    
    setPhotographers(data)
    setFilteredPhotographers(data)
  }, [stad])

  useEffect(() => {
    let filtered = photographers.filter(photographer =>
      photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photographer.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredPhotographers(filtered)
  }, [searchTerm, sortBy, photographers])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/fotografen" className="inline-flex items-center text-[#0077B5] hover:text-[#005885] mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar overzicht
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fotografen in {stadNaam}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {filteredPhotographers.length} professionele fotografen gevonden
          </p>
        </div>

        {/* Call to Action */}
        <div className="mb-12 text-center">
          <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Professionele fotoshoot nodig? Kan nu online zonder fotograaf!
            </h2>
            <div className="text-lg mb-6 opacity-90">
              <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
                <span className="text-center">✅</span>
                <span>6x goedkoper dan een fotograaf</span>
                <span className="text-center">✅</span>
                <span>40 professionele foto's in 15 min</span>
                <span className="text-center">✅</span>
                <span>Perfect voor LinkedIn, website en print</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
              <Link href="/">
                Even wat foto's uploaden, dat is alles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Zoek op naam of beschrijving..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sorteer op..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Naam (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Photographers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotographers.map((photographer) => (
            <Card key={photographer.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {photographer.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {photographer.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={`https://${photographer.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Bekijk Website
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPhotographers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Geen fotografen gevonden voor "{searchTerm}" in {stadNaam}
            </p>
          </div>
        )}

        {/* SEO Content & FAQ - Only for top 10 cities */}
        {(['amsterdam', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven', 'tilburg', 'groningen', 'almere', 'breda', 'nijmegen'].includes(stad)) && (
          <>
            {/* SEO Content */}
            <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="prose prose-lg max-w-none">
                {stad === 'amsterdam' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Zakelijke Fotografie in Amsterdam: Professionele LinkedIn Foto's & Bedrijfsportretten</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Amsterdam is het economische hart van Nederland en de perfecte stad voor professionele zakelijke fotografie. Of je nu een LinkedIn profielfoto nodig hebt voor je carrière in de financiële sector, een bedrijfsportret voor je startup in Amsterdam Noord, of teamfoto's voor je kantoor aan de Zuidas - Amsterdam biedt talloze mogelijkheden voor hoogwaardige zakelijke fotografie.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      De stad herbergt internationale bedrijven, creatieve agencies en innovatieve startups die allemaal investeren in professionele beeldvorming. Van corporate headshots in het Concertgebouw gebied tot lifestyle business fotografie in de Jordaan - Amsterdamse fotografen begrijpen de dynamiek van de zakelijke wereld en weten hoe ze jouw professionele uitstraling perfect kunnen vastleggen.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Social media fotografie is cruciaal geworden voor bedrijven in Amsterdam. Instagram posts, LinkedIn content en website headers vereisen allemaal hoogwaardige, professionele beelden die jouw merk versterken en je doelgroep aanspreken.
                    </p>
                  </>
                )}
                
                {stad === 'rotterdam' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professionele Fotografie Rotterdam: Zakelijke Portretten & LinkedIn Fotoshoots</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Rotterdam staat bekend om zijn moderne skyline en innovatieve bedrijfscultuur. Deze dynamische havenstad biedt een unieke setting voor zakelijke fotografie, van corporate headshots met de iconische Erasmusbrug op de achtergrond tot industriële bedrijfsfotografie in de haven.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      De stad trekt internationale handelsbedrijven, logistieke ondernemingen en tech startups die allemaal hun professionele imago willen versterken. Rotterdamse fotografen excelleren in het creëren van krachtige zakelijke portretten die de ambitieuze spirit van de stad weerspiegelen.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Voor LinkedIn profielfoto's, teamportretten of social media content - Rotterdam biedt de perfecte combinatie van moderne architectuur en professionele expertise voor al je zakelijke fotografie behoeften.
                    </p>
                  </>
                )}

                {stad === 'den-haag' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Zakelijke Fotografie Den Haag: Corporate Portretten & Overheids Fotografie</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Den Haag, de bestuurlijke hoofdstad van Nederland, is het centrum van politiek, recht en internationale organisaties. Deze unieke positie maakt de stad tot een hotspot voor high-level corporate fotografie, van ministeriële portretten tot internationale business headshots.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Fotografen in Den Haag zijn gespecialiseerd in formele zakelijke fotografie die past bij de professionele standaarden van overheidsinstanties, advocatenkantoren en internationale bedrijven. Of je nu een LinkedIn foto nodig hebt voor een functie bij een ministerie of teamfoto's voor je consultancy firma - Den Haag heeft de expertise.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Social media presence is ook cruciaal voor professionals in Den Haag. Van diplomatic posts tot legal expertise - jouw online uitstraling moet je autoriteit en betrouwbaarheid uitstralen.
                    </p>
                  </>
                )}

                {stad === 'utrecht' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Bedrijfsfotografie Utrecht: Centraal Gelegen Expertise voor Zakelijke Fotografie</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Utrecht's centrale ligging maakt het de perfecte hub voor zakelijke fotografie in de Randstad. De stad combineert historische charme met moderne business faciliteiten, wat resulteert in veelzijdige mogelijkheden voor professionele fotoshoots.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Van corporate portretten bij het Utrechtse station tot creatieve business fotografie in de binnenstad - Utrecht biedt een unieke mix van professionele settings. De stad herbergt hoofdkantoren van nationale bedrijven en groeiende startups die allemaal investeren in hoogwaardige zakelijke beeldvorming.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      LinkedIn fotografie en social media content zijn essentieel voor professionals in Utrecht. Of je nu in de zorg, technologie of consultancy werkt - een sterke online presence begint met professionele foto's.
                    </p>
                  </>
                )}

                {stad === 'eindhoven' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tech & Innovatie Fotografie Eindhoven: Zakelijke Portretten in Brainport</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Eindhoven, het kloppende hart van Brainport Nederland, is synoniem met technologische innovatie en high-tech ondernemerschap. Deze unieke positie vereist gespecialiseerde zakelijke fotografie die de innovatieve spirit van de stad weergeeft.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Van corporate headshots voor ASML medewerkers tot startup fotografie op de High Tech Campus - Eindhovense fotografen begrijpen de specifieke behoeften van de tech industrie. Ze excelleren in het creëren van moderne, forward-thinking business portretten.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Social media marketing is cruciaal in de tech wereld van Eindhoven. LinkedIn posts, bedrijfswebsites en innovatie showcases vereisen allemaal hoogwaardige, professionele beelden die technologische expertise uitstralen.
                    </p>
                  </>
                )}

                {stad === 'tilburg' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professionele Fotografie Tilburg: Zakelijke Portretten & Bedrijfsfotografie</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Tilburg combineert een rijke industriële geschiedenis met moderne zakelijke ontwikkelingen. Deze dynamische stad in het hart van Brabant biedt excellente mogelijkheden voor professionele zakelijke fotografie, van corporate headshots tot industriële bedrijfsfotografie.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      De stad herbergt een diverse mix van bedrijven, van traditionele industrie tot moderne dienstverlening en onderwijs. Tilburgse fotografen zijn ervaren in het vastleggen van deze verscheidenheid en creëren zakelijke portretten die perfect aansluiten bij jouw branche en persoonlijkheid.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Voor LinkedIn profielfoto's, teamfotografie of social media content - Tilburg biedt de warmte en professionaliteit die kenmerkend zijn voor Noord-Brabant, gecombineerd met moderne fotografische expertise.
                    </p>
                  </>
                )}

                {stad === 'groningen' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Zakelijke Fotografie Groningen: Noordelijke Professionaliteit & LinkedIn Fotoshoots</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Groningen, de bruisende hoofdstad van het Noorden, combineert academische excellentie met ondernemende energie. Deze unieke mix creëert een dynamische omgeving voor professionele zakelijke fotografie, van universitaire corporate portretten tot innovative business headshots.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      De stad is een centrum voor energie, landbouw, en kenniseconomie, met een groeiende startup scene. Groningse fotografen excelleren in het creëren van authentieke, no-nonsense zakelijke portretten die de directe, eerlijke aanpak van het Noorden weerspiegelen.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Social media presence is essentieel voor professionals in Groningen. Of je nu in de energiesector, academische wereld of lokale business werkt - een sterke LinkedIn profiel en professionele website beelden zijn cruciaal voor succes.
                    </p>
                  </>
                )}

                {stad === 'almere' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderne Bedrijfsfotografie Almere: Innovatieve Zakelijke Portretten</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Almere, Nederland's nieuwste grote stad, staat symbool voor moderne innovatie en ondernemerschap. Deze jonge, dynamische stad biedt unieke mogelijkheden voor hedendaagse zakelijke fotografie die past bij de forward-thinking mentaliteit van haar bewoners.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Met zijn moderne architectuur en groen-geïntegreerde business districts, biedt Almere fotografen inspirerende settings voor professionele fotoshoots. Van corporate headshots in moderne kantoorgebouwen tot outdoor business portretten in de karakteristieke parken.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      LinkedIn fotografie en social media content zijn essentieel voor de vele professionals die in Almere wonen maar in de Randstad werken. Een sterke online presence helpt je opvallen in de competitieve Randstad markt.
                    </p>
                  </>
                )}

                {stad === 'breda' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Zakelijke Fotografie Breda: Professionele Portretten in Parel van het Zuiden</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Breda, vaak genoemd de 'Parel van het Zuiden', combineert historische grandeur met moderne zakelijke dynamiek. Deze sfeervolle Brabantse stad biedt excellente mogelijkheden voor high-end zakelijke fotografie in zowel historische als hedendaagse settings.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Van corporate fotoshoots in het kasteel van Breda tot moderne business portretten in de vernieuwde binnenstad - Bredase fotografen begrijpen hoe ze de warme, toegankelijke Brabantse cultuur kunnen combineren met professionele zakelijke uitstraling.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Social media marketing en LinkedIn presence zijn cruciaal voor bedrijven in Breda. Of je nu in de logistiek, voedselindustrie of creatieve sector werkt - professionele beeldvorming helpt je concurreren op nationaal niveau.
                    </p>
                  </>
                )}

                {stad === 'nijmegen' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professionele Fotografie Nijmegen: Zakelijke Portretten in de Oudste Stad</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Nijmegen, Nederland's oudste stad, biedt een unieke combinatie van historisch erfgoed en moderne zakelijke ontwikkeling. Deze karakteristieke Gelderse stad aan de Waal creëert inspirerende mogelijkheden voor authentieke zakelijke fotografie.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Met de aanwezigheid van de Radboud Universiteit, het UMC en diverse internationale bedrijven, heeft Nijmegen een rijke zakelijke community die investeert in professionele beeldvorming. Van academische portretten tot corporate headshots - de stad biedt expertise voor elke sector.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      LinkedIn fotografie en business social media zijn essentieel voor professionals in Nijmegen. Of je nu in de zorg, onderwijs, of internationale business werkt - een sterke online presence begint met kwalitatieve, professionele fotografie.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Veelgestelde Vragen over Fotografie in {stadNaam}</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Wat zijn de kosten voor professionele foto's in {stadNaam}?</h3>
                  <p className="text-gray-700">
                    Professionele fotografen in {stadNaam} hanteren tarieven van €150-500+ voor een fotoshoot. Als alternatief biedt onze AI-technologie een kosteneffectieve oplossing die 40 professionele foto's genereert in 15 minuten.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Wat zijn de voordelen van AI-fotografie voor LinkedIn foto's?</h3>
                  <p className="text-gray-700">
                    AI-fotografie biedt een moderne aanpak: upload enkele foto's online en onze technologie zorgt voor professionele resultaten. Dit betekent geen reistijd, flexibele timing en binnen 15 minuten 40 verschillende professionele variaties.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hoe snel kan ik professionele foto's krijgen?</h3>
                  <p className="text-gray-700">
                    Met AI-technologie ontvang je binnen 15 minuten 40 professionele foto's. Dit is ideaal voor urgente situaties zoals last-minute sollicitaties of snelle LinkedIn updates, wanneer traditionele fotoshoots niet haalbaar zijn.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Wanneer kies je voor AI-fotografie vs. een traditionele fotograaf?</h3>
                  <p className="text-gray-700">
                    Beide opties hebben hun plaats. Traditionele fotografen bieden persoonlijke service en creativiteit. AI-fotografie is ideaal voor snelle, consistente resultaten, budgetvriendelijke oplossingen en wanneer je meerdere stijlen wilt uitproberen zonder herhaalde kosten.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hoe werkt de AI-fotoshoot technologie?</h3>
                  <p className="text-gray-700 mb-4">
                    Upload enkele van je foto's en onze AI analyseert deze om jouw unieke kenmerken te leren. Vervolgens genereert het 40 professionele variaties met verschillende achtergronden, belichting en poses - allemaal perfect voor LinkedIn, websites en print.
                  </p>
                  <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-lg p-4 text-white">
                    <p className="font-semibold mb-2">Professionele fotoshoot nodig? Kan nu online zonder fotograaf!</p>
                    <div className="text-sm opacity-90 mb-3">
                      <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
                        <span className="text-center">✅</span>
                        <span>6x goedkoper dan een fotograaf</span>
                        <span className="text-center">✅</span>
                        <span>40 professionele foto's in 15 min</span>
                        <span className="text-center">✅</span>
                        <span>Perfect voor LinkedIn, website en print</span>
                      </div>
                    </div>
                    <Button asChild size="sm" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold">
                      <Link href="/">
                        Even wat foto's uploaden, dat is alles →
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  )
}