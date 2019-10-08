import RoomsTemplate from '../../../templates/main_menu/rooms_content.pug';

export function RoomCreator(container) {
    //page = GetPaginatorId()
    //templateContent = GetRoomsByPage()

    const page = 10;
    let templateContent = [];
    templateContent.push({
        name: 'Топовая комната',
        amount: '4/5',
    });
    templateContent.push({
        name: 'Топовая комната',
        amount: '4/5',
    });
    templateContent.push({
        name: 'Топовая комната',
        amount: '4/5',
    });
    templateContent.push({
        name: 'Топовая комната',
        amount: '4/5',
    });

    container.insertAdjacentHTML('beforeend', RoomsTemplate({
        templateContent,
        page
    }));
}