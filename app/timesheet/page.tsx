"use client"; // needed for interactivity
import Link from "next/link";
import { useState } from "react";
import { getPeriod } from '../utils/payperiod';

//need to make this async and password protect it at some point
export default function home(){ // we might want to find a way to protect this ig

  let period= getPeriod();

  //this and save are a package deal. these update our database with the currently filled in values!
  const [dataResponse, setdataResponse] = useState([]);
  const saveDay = async (info:string) =>{ // got this from a tutorial, not really fully sure how this works
    const apiUrlEndpoint = 'http://localhost:3000/api/mkday'+info;
    const response = await fetch(apiUrlEndpoint);
    //const res = await response.json(); //-> at some point our return will be a success message with a popup
    //setdataResponse(res.resp); // but for now we arent returning anything but an error so we just ignore our output
  }
  function save(){
    period.forEach((day)=>{
      let cday=day;
      let cship=document.getElementById(cday+'_ship').value; // literally fraudulent error, maybe something wrong with my editors config
      if(cship=='') cship = document.getElementById(cday+'_ship').getAttribute('placeholder');
      console.log(cday + ': ' +cship);
      //build our query!
      saveDay('?uid='+'none'+'&day='+cday+'&ship='+cship);
    })
  }
  //end package deal

  return (
    <main className="flex min-h-screen flex-col items-center">  
    
      
      <div className='headWrap'>{/*for some reason i need to wrap this or the whole page is inline-flex row*/}
        <div className='tblHead'>
          <div className='tblHeadItm'>
            <strong>Date</strong>
          </div>
          {/* DELETE THIS AS SOON AS I GET PERMISSION TO DO SO */}
          <div className='tblHeadItm'>
            <strong>worked?</strong>
          </div>
          <div className='tblHeadItm'>
            <strong>Vessels</strong>  
          </div>
        </div>
      </div>

      { //this generates our payperiod table 
        period.map((day)=> // we get an error here because this list lacks keys but i dont think it really matters tbg lol
          <div className='tblBody' id={day+' item'}>
            <div className='tblBodyItm'>
              {
                //day.toString()
                day
              }
            </div>
            {/* DELETE THIS AS SOON AS I GET PERMISSION TO DO SO */}
            <div className='tblBodyItm'>
              <input type='checkbox'/>
            </div>
            <div className='tblBodyItm'>
              <input type='text' className='shipInput' id={day+'_ship'} placeholder={'test'}/>
            </div>
          </div>  
        )
      }
        <div className='tblFoot'>
          <button className='tblFootBtn' onClick={save}>save</button> {/*lets do a little pop-up that says saved when we click this */}
          <Link href='timesheet/review'><div className='tblFootBtn'> review </div></Link>
        </div>
    </main>
  );
}