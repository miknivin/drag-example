import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';


export function Draggable() {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'unique-id',
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  
  return (
    <button className='w-50 bg-red-600' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      Render whatever you like within 
    </button>
  );
}