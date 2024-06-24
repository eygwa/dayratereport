"use client"; // needed for interactivity
import { useState, useEffect, HTMLInputTypeAttribute } from "react";
import { getPeriod } from '@/utils/payperiod';
import { getPort } from '@/utils/getPort';
import { fetchBoth } from '@/utils/fetchBoth';
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { flashDiv } from "@/utils/flashDiv";

//page globals
const por=getPort();
const period= getPeriod();
let runcount=1;
const slist:string[] = [
    '',
    'BMCC',
    'EMMA',
    'PROT',
    'GYRE',
    'NAUT',
    '3RD',
    '????',
    
] // may change this to query a database at some point, for now its just hard set


export default function Home(){
    const router = useRouter();
    //function for saving our ship
    const review = async () => {
        if(await save()) router.push('/daysworked/review')
    }

    const save = async () =>{ 
        let strdict=''
        period.map((day) => { 
            //setting up constants makes the logic look way cleaner
            const inp= (document.getElementById(day+'_ship') as HTMLInputElement).value.substring(0, 15) || ''; // trim to prevent overflow
            //const box= (document.getElementById(day+'_worked') as HTMLInputElement).checked
           
            //read our displayed tabl
            
            //prepare our output
            strdict+=day+':'+inp+';';

            //update our displayed table
            //(document.getElementById(day+'_ship') as HTMLInputElement).value='';
            //inp ? (document.getElementById(day+'_worked') as HTMLInputElement).checked = true : (document.getElementById(day+'_worked') as HTMLInputElement).checked = false;
            
        })
        if(selected==''){
            const target= document.getElementById('target') as HTMLElement
            flashDiv(target)
            return false
        }
        selected=='domestic' ? strdict+='&dom=1':strdict+='&dom=0' // flags if you are a domestic or foreign worker
        const apiUrlEndpoint = por+'/api/mkday?days='+strdict;
        await fetchBoth(apiUrlEndpoint);
        return true;
    }
    const [selected, setSelected] = useState('')
    const [dataResponse, setdataResponse] = useState([]);
        useEffect(() => {

            //query database
            async function getPeriodInf(){
                const apiUrlEndpoint = por+'/api/getperiodinf';
                const response = await fetchBoth(apiUrlEndpoint);
                const res = await response.json();
                
                try{
                    (res.resp).forEach((item:any)=>{ // for some reason i need to :any to compile, annoying!
                        if(item['day']=='-1'){
                            item['ship']=='1' ? setSelected('domestic') : setSelected('foreign')
                            return
                        }
                    })
                }
                catch{}
                setdataResponse(res.resp); 
                
            }
            getPeriodInf();

            
            //event listeners are async and thus must be wrapped in some kind of useeffect
            document.addEventListener('keydown', e => { // catch ctrls
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    if(e.repeat) return; // stops hold from looping this function
                    if((runcount%2)==1){ // ignore every other since this always triggers at least twice
                        save();
                    } 
                    runcount+=1;
                    return; // idk how important this is to be honest
                }
            });
        }, []
    );

    //build a dictionary mapping ships to days
    var dict: {[id: string] : string} = {};
    try{
        dataResponse.forEach((item) => {
            if(item['day']=='-1'){
                return
            }
            dict[item['day']]=item['ship']
            //if(item['ship']) (document.getElementById(item['day']+'_worked') as HTMLInputElement).checked = true;
        }) 
    }
    catch{ // if we arent logged in dataresponse will be null, throwing an error
        redirect('../')
    }
    const re = (inp:string) => {
        if(inp=='BMCC')console.log(inp=='BMCC')
        return 'BMCC'
    }
    console.log('refresh')
    //generate html
    return (
        <main className="flex min-h-screen flex-col items-center px-1">  
            <div className='tblWrapper'>
                <div className='tblHead'>
                    <div className='tblHeadCheck'>
                        <input type='checkbox' id={'all'} />
                    </div>
                    <div className='tblHeadDate'>
                        <strong>DATE</strong>
                    </div>
                    <div className='tblHeadShip'>
                        <strong>VESSEL</strong>
                    </div>
                </div>
                <div>
                    {
                    period.map((day:string)=>
                        <div key={day} id={day+' item'} className='tblRow'>
                            <div className="tblBodyCheck">
                                <input type='checkbox' id={day+'_worked'}/>
                            </div>
                            <div className="tblBodyDate">
                                {day}
                            </div>
                            {/*this may be worth wrapping in a box, just to indicate better you can fill it out*/}
                            <div className="tblBodyShip">
                                <select className='shipInput' id={day+'_ship'} defaultValue={re(dict[day])}>
                                    { 
                                        slist.map((item)=>
                                            <option 
                                                key={day+item}
                                                value={item} 
                                                label={item} 
                                                className='shipOption'
                                            />
                                        )
                                    }
                                </select>
                            </div>
                        </div>  
                    )}
                </div>

                <div className='crewtype' id='target'>
                    CREW:
                        <button onClick={()=>setSelected('domestic')} className={selected=='domestic'? 'selectedCrew': 'unselectedCrew'}>domestic</button>
                        <button onClick={()=>setSelected('foreign')} className={selected=='foreign'? 'selectedCrew': 'unselectedCrew'}>foreign</button>
                </div>
            </div>





            <div className='tblFoot'>
                <button className='tblFootBtn' onClick={save}> save </button>
                <button className='tblFootBtn' onClick={review}> review </button>
            </div>
        </main>
    );
}
