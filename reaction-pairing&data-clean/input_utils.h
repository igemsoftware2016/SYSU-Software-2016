#ifndef __INPUT_UTILS__
#define __INPUT_UTILS__

#include <set>
#include <map>
#include <string>
#include <vector>
#include <fstream>
#include <iostream>
#include <sstream>
#include <utility>
#include "unistd.h"
#include <cassert>

namespace mol {

using std :: min;
using std :: set;
using std :: endl;
using std :: cout;
using std :: ofstream;
using std :: ifstream;
using std :: map;
using std :: vector;
using std :: string;
using std :: stringstream;
using std :: make_pair;

static vector <string> forbid_org = {
"Bacillus anthracis",
"Brucella abortus",
"Brucella canis",
"Brucella melitensis",
"Brucella suis",
"Burkholderia mallei (formerly Pseudomonas mallei)",
"Burkholderia pseudomallei (formerly Pseudomonas pseudomallei)",
"Chlamydophila psittaci (avian strains)",
"Coxiella burnetti",
"Ehrlichia sennetsu (Rickettsia sennetsu)",
"Escherichia coli, verocytotoxigenic strains (eg O157:H7 or O103)",
"Francisella tularensis (Type A)",
"Mycobacterium africanum",
"Mycobacterium bovis",
"Mycobacterium leprae",
"Mycobacterium malmoense",
"Mycobacterium microti",
"Mycobacterium szulgai",
"Mycobacterium tuberculosis",
"Mycobacterium ulcerans",
"Pseudomonas mallei",
"Pseudomonas pseudomallei",
"Rickettsia akari",
"Rickettsia canada",
"Rickettsia conorii",
"Rickettsia montana",
"Rickettsia mooseri",
"Rickettsia prowazekii",
"Rickettsia rickettsii",
"Rickettsia sennetsu",
"Rickettsia spp",
"Rickettsia tsutsugamushi",
"Rickettsia typhi (Rickettsia mooseri)",
"Salmonella paratyphi A",
"Salmonella paratyphi B/java",
"Salmonella paratyphi C/Choleraesuis",
"Salmonella typhi",
"Shigella dysenteriae (Type 1)",
"Yersinia pestis",
"Echinococcus granulosus",
"Echinococcus multilocularis",
"Echinococcus vogeli",
"Taenia solium",
"Leishmania brasiliensis",
"Leishmania donovani",
"Naegleria fowleri",
"Plasmodium falciparum",
"Trypanosoma brucei rhodesiense",
"Trypanosoma cruzi",
"Sporadic Creutzfeldt-Jakob disease agent",
"Sporadic fatal insomnia agent",
"Variably protease-resistant prionopathy agent",
"Familial Creutzfeldt-Jakob disease agent",
"Fatal familial insomnia agent",
"Gerstmann-Sträussler-Scheinker syndrome agent",
"Variant Creutzfeldt-Jakob disease agent",
"Iatrogenic Creutzfeldt-Jakob disease agent",
"Kuru agent",
"Bovine spongiform encephalopathy (BSE) agent and other related animal TSEs",
"H-type BSE agent",
"L-type BSE agent",
"B virus",
"Herpesvirus simiae",
"Macacine herpesvirus 1",
"Borna disease virus",
"Bundibugyo ebolavirus",
"Reston ebolavirus",
"Sudan ebolavirus",
"Tai Forest ebolavirus",
"Zaire ebolavirus",
"Marburg marburgvirus",
"Hendra virus (formerly equine morbillivirus)",
"Nipah virus",
"Australian bat lyssavirus",
"Duvenhage virus",
"European bat lyssaviruses 1 and 2",
"Lagos bat virus",
"Mokola virus",
"Rabies virus",
"Other Lyssavirus species not listed above",
"Piry virus",
"MERS-related coronavirus",
"SARS-related coronavirus",
"Poliovirus type 2",
"Chapare virus",
"Flexal virus",
"Guanarito virus",
"Junin virus",
"Lassa fever virus",
"Lujo virus",
"Lymphocytic choriomeningitis virus LCMV (all strains other than Armstrong)",
"Machupo virus",
"Mobala virus",
"Sabia virus",
"Andes virus",
"Belgrade (Dobrava) virus",
"Hantaan virus (Korean haemorrhagic fever)",
"Seoul virus",
"Sin Nombre virus (formerly Muerto Canyon)",
"Crimean/Congo haemorrhagic fever virus",
"Bunyavirus germiston",
"Germiston virus",
"La Crosse virus",
"Ngari virus",
"Oropouche virus",
"Snowshoe hare virus",
"Rift Valley fever virus",
"Bhanja virus",
"Severe fever with thrombocytopoenia syndrome virus (SFTS)",
"Absettarov virus",
"Alkhurma haemorrhagic fever virus",
"Central European tick-borne encephalitis virus",
"Dengue viruses types 1–4",
"Far Eastern tick-borne encephalitis virus",
"Hanzalova virus",
"Hypr virus",
"Israel turkey meningitis meningoencephalomyelitis virus",
"Japanese encephalitis virus",
"Kumlinge virus",
"Kyasanur Forest disease virus",
"Louping ill virus",
"Murray Valley encephalitis virus",
"Negishi virus",
"Omsk haemorrhagic fever virus",
"Powassan virus",
"Rocio virus",
"Russian spring–summer encephalitis virus",
"Sal Vieja virus",
"San Perlita virus",
"Siberian tick-borne encephalitis virus",
"Spondweni virus",
"St Louis encephalitis virus",
"Tick-borne encephalitis virus",
"Wesselsbron virus",
"West Nile fever virus",
"Yellow fever virus",
"Hepatitis C virus",
"Human pegivirus",
"Hepatitis B virus",
"Hepatitis D virus (delta)",
"Hepatitis E virus",
"Monkeypox virus",
"Variola virus (major and minor)",
"Banna virus",
"Primate T-cell lymphotropic viruses types 1 and 2",
"Human immunodeficiency viruses",
"Simian immunodeficiency virus",
"Eastern equine encephalomyelitis encephalitis virus",
"Everglades virus",
"Getah virus",
"Mayaro virus",
"Middelburg virus",
"Mucambo virus",
"Ndumu virus",
"Sagiyama virus",
"Tonate virus",
"Venezuelan equine encephalitis virus",
"Western equine encephalitis virus",
"Ajellomyces dermatitidis",
"Blastomyces dermatitidis (Ajellomyces dermatitidis)",
"Cladophialophora bantiana (formerly Xylohypha bantiana,Cladosporium bantianum)",
"Cladosporium bantianum (formerly Xylohypha bantiana)",
"Coccidioides immitis",
"Coccidioides posadasii",
"Histoplasma capsulatum var capsulatum (Ajellomyces capsulatus)",
"Histoplasma capsulatum var duboisii",
"Histoplasma capsulatum var farcinimosum",
"Paracoccidioides brasiliensis",
"Penicillium marneffei",
"Rhinocladiella mackenziei (formerly Ramichloridium)",
"Xylohypha bantiana"
};

class substance {
public:
	map <string, int> atom;
	set <string> types, comm;
	string name, ID;
	substance();
	~substance();
	void clear();
private:
	// no ptr used, same as deep copy
	//substance(const substance&);
	substance& operator = (const substance&);
};

class reaction {
public:
	map <string, int> sub, pdt;
	set <string> enr;
	string ec_name;

	reaction();
	~reaction();
	void clear();
private:
	// no ptr used, same as deep copy
	//reaction(const reaction&);
	reaction& operator = (const reaction&);
};

class mol_file {
public:
	mol_file();
	~mol_file();
private:
	mol_file(const mol_file&);
	mol_file& operator = (const mol_file&);
};

string all_caps(string);
int to_int(string x);
bool drop_test(string x);
string get_element(string str, string x);
bool check_element(string str, string x);
string first_useful(ifstream & fin);
bool input_initial(vector <reaction>&, map <string, substance>&);
vector <string> split(const string&);
static string spc;

};

#endif
