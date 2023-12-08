export const editBannedList = ['example_user@email.com'];

export const isAllowed = (username, banList) => {
    if (banList.includes(username)) {
        return false;
    }
    return true;
}
