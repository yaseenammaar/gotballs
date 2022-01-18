import react, {useRef, useState} from 'react';

export default () => {
const [isActive, setIsActive] = useState(false)
   const refElement1 = useRef(null);
   const refElement2 = useRef(null);
   const refElement3 = useRef(null);
   const imageReference = useRef(null);


   const buttononCLick =  (i) => {
       if(i==1){
           imageReference.current.src = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"

           refElement1.current.className = "rounded-md hover:border-solid pl-2 pr-2 border-solid py-1.5 border-4 border-indigo-600 element"
       }else{
            refElement1.current.className = "rounded-md hover:border-solid pl-2 pr-2 border-dashed py-1.5 border-2 border-indigo-600 element"

       }

       if(i==2){

        refElement2.current.className = "rounded-md hover:border-solid pr-2 ml-2 pl-2 py-1.5 border-solid border-4 border-indigo-600 element"
        }else{
            refElement2.current.className = "rounded-md hover:border-solid pr-2 ml-2 pl-2 py-1.5 border-dashed border-2 border-indigo-600 element"

        }

    if(i==3){

        refElement3.current.className = "rounded-md hover:border-solid pr-2 ml-2 pl-2 py-1.5 border-solid border-4 border-indigo-600 element"
        }else{
            refElement3.current.className = "rounded-md hover:border-solid pr-2 ml-2 pl-2 py-1.5 border-dashed border-2 border-indigo-600 element"

        }
    }

   return (
     <div className="bg-gray-600 py-[350px]  mx-[500px]" ref={imageReference}>
                  <div className="text-center  text-4xl text-neutral-50">
                      <span onClick={() => buttononCLick(1)}  className="rounded-md hover:border-solid pl-2 pr-2 border-dashed py-1.5 border-2 border-indigo-600 element" ref={refElement1} id="element1">11</span>

                      <span onClick={() => buttononCLick(2)} id="element2" className="rounded-md hover:border-solid pr-2 ml-2 pl-2 py-1.5 border-dashed border-2 border-indigo-600 element" ref={refElement2}>January</span>

                      <span onClick={() => buttononCLick(3)} id="element3" className="rounded-md hover:border-solid pr-2 ml-2 pl-2 py-1.5 border-dashed border-2 border-indigo-600 element" ref={refElement3}>2020</span>
                      
                  </div>
                  <div className="float-right align-bottom text-3xl pr-10">
                    <span >Sunday</span>
                  </div>
                </div>


   )
}